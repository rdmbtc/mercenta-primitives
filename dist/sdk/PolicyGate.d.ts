/**
 * Mercenta Primitives — TypeScript Policy Gate SDK
 * Deterministic 5-step policy validator for autonomous agent commerce on Arc.
 */
export interface OrderIntent {
    orderId: string;
    listingId: string;
    supplier: string;
    orderValueUsdc: bigint;
    supplierCostUsdc: bigint;
    category: 'compute' | 'tokens' | 'subscriptions' | 'gaming' | 'api';
    region?: string;
}
export interface PolicyConfig {
    availableToSpendUsdc: bigint;
    reservedLiquidityUsdc: bigint;
    totalBalanceUsdc: bigint;
    grossMarginFloorBps: bigint;
    autoApprovalLimitUsdc: bigint;
    verifiedSuppliers: Set<string>;
}
export type PolicyDecision = 'Cleared' | 'PolicyBlocked' | 'HumanApprovalRequired';
export interface EvaluationResult {
    decision: PolicyDecision;
    reason: string;
    checks: {
        availableSpendPassed: boolean;
        reservedLiquidityPassed: boolean;
        grossMarginFloorPassed: boolean;
        supplierVerifiedPassed: boolean;
        autoApprovalLimitPassed: boolean;
    };
    marginBps: bigint;
    marginPercent: string;
}
/**
 * Evaluates an autonomous agent order intent against the 5-step deterministic policy sequence.
 */
export declare function evaluatePolicy(intent: OrderIntent, config: PolicyConfig): EvaluationResult;
//# sourceMappingURL=PolicyGate.d.ts.map