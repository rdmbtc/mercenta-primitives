/**
 * Mercenta Primitives — TypeScript Policy Gate SDK
 * Deterministic 5-step policy validator for autonomous agent commerce on Arc.
 */
/**
 * Evaluates an autonomous agent order intent against the 5-step deterministic policy sequence.
 */
export function evaluatePolicy(intent, config) {
    // Step 1: Available to Spend Check
    const availableSpendPassed = intent.orderValueUsdc <= config.availableToSpendUsdc;
    if (!availableSpendPassed) {
        return {
            decision: 'PolicyBlocked',
            reason: `Order value (${Number(intent.orderValueUsdc) / 1e6} USDC) exceeds available spend limit (${Number(config.availableToSpendUsdc) / 1e6} USDC).`,
            checks: {
                availableSpendPassed: false,
                reservedLiquidityPassed: false,
                grossMarginFloorPassed: false,
                supplierVerifiedPassed: false,
                autoApprovalLimitPassed: false
            },
            marginBps: 0n,
            marginPercent: '0.00%'
        };
    }
    // Step 2: Reserved Liquidity Check
    const spendableBuffer = config.totalBalanceUsdc > config.reservedLiquidityUsdc
        ? config.totalBalanceUsdc - config.reservedLiquidityUsdc
        : 0n;
    const reservedLiquidityPassed = intent.supplierCostUsdc <= spendableBuffer;
    if (!reservedLiquidityPassed) {
        return {
            decision: 'PolicyBlocked',
            reason: `Supplier cost (${Number(intent.supplierCostUsdc) / 1e6} USDC) would breach required reserve floor (${Number(config.reservedLiquidityUsdc) / 1e6} USDC).`,
            checks: {
                availableSpendPassed: true,
                reservedLiquidityPassed: false,
                grossMarginFloorPassed: false,
                supplierVerifiedPassed: false,
                autoApprovalLimitPassed: false
            },
            marginBps: 0n,
            marginPercent: '0.00%'
        };
    }
    // Step 3: Gross Margin Floor Check
    if (intent.orderValueUsdc <= intent.supplierCostUsdc) {
        return {
            decision: 'PolicyBlocked',
            reason: `Negative or zero margin detected. Order value (${Number(intent.orderValueUsdc) / 1e6}) <= supplier cost (${Number(intent.supplierCostUsdc) / 1e6}).`,
            checks: {
                availableSpendPassed: true,
                reservedLiquidityPassed: true,
                grossMarginFloorPassed: false,
                supplierVerifiedPassed: false,
                autoApprovalLimitPassed: false
            },
            marginBps: 0n,
            marginPercent: '0.00%'
        };
    }
    const profit = intent.orderValueUsdc - intent.supplierCostUsdc;
    const marginBps = (profit * 10000n) / intent.orderValueUsdc;
    const grossMarginFloorPassed = marginBps >= config.grossMarginFloorBps;
    const marginPercent = `${(Number(marginBps) / 100).toFixed(2)}%`;
    if (!grossMarginFloorPassed) {
        const requiredPercent = `${(Number(config.grossMarginFloorBps) / 100).toFixed(2)}%`;
        return {
            decision: 'PolicyBlocked',
            reason: `Projected gross margin (${marginPercent}) is below required floor (${requiredPercent}).`,
            checks: {
                availableSpendPassed: true,
                reservedLiquidityPassed: true,
                grossMarginFloorPassed: false,
                supplierVerifiedPassed: false,
                autoApprovalLimitPassed: false
            },
            marginBps,
            marginPercent
        };
    }
    // Step 4: Supplier Verification Check
    const supplierVerifiedPassed = config.verifiedSuppliers.has(intent.supplier.toLowerCase());
    if (!supplierVerifiedPassed) {
        return {
            decision: 'PolicyBlocked',
            reason: `Supplier ${intent.supplier} is not verified in Mercenta catalog.`,
            checks: {
                availableSpendPassed: true,
                reservedLiquidityPassed: true,
                grossMarginFloorPassed: true,
                supplierVerifiedPassed: false,
                autoApprovalLimitPassed: false
            },
            marginBps,
            marginPercent
        };
    }
    // Step 5: Auto-Approval Spending Threshold Check
    const autoApprovalLimitPassed = intent.orderValueUsdc <= config.autoApprovalLimitUsdc;
    if (!autoApprovalLimitPassed) {
        return {
            decision: 'HumanApprovalRequired',
            reason: `Order value (${Number(intent.orderValueUsdc) / 1e6} USDC) exceeds autonomous ceiling (${Number(config.autoApprovalLimitUsdc) / 1e6} USDC). Enqueued for approval.`,
            checks: {
                availableSpendPassed: true,
                reservedLiquidityPassed: true,
                grossMarginFloorPassed: true,
                supplierVerifiedPassed: true,
                autoApprovalLimitPassed: false
            },
            marginBps,
            marginPercent
        };
    }
    // All 5 checks passed
    return {
        decision: 'Cleared',
        reason: 'All 5 deterministic policy checks passed. Cleared for atomic Arc settlement.',
        checks: {
            availableSpendPassed: true,
            reservedLiquidityPassed: true,
            grossMarginFloorPassed: true,
            supplierVerifiedPassed: true,
            autoApprovalLimitPassed: true
        },
        marginBps,
        marginPercent
    };
}
//# sourceMappingURL=PolicyGate.js.map