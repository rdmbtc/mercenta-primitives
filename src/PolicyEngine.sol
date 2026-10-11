// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PolicyEngine
 * @notice Deterministic 5-step policy validator for autonomous agent checkout rails on Arc.
 * @dev Enforces available spend, liquidity floors, margin minimums, supplier checks, and spending thresholds.
 */
contract PolicyEngine {
    uint256 public constant BPS_DENOMINATOR = 10000;

    struct PolicyConfig {
        uint256 availableToSpendUsdc; // 6-decimal USDC
        uint256 reservedLiquidityUsdc; // 6-decimal USDC
        uint256 totalBalanceUsdc; // 6-decimal USDC
        uint256 grossMarginFloorBps; // e.g. 1500 = 15.0%
        uint256 autoApprovalLimitUsdc; // 6-decimal USDC spending ceiling
    }

    struct OrderIntent {
        bytes32 orderId;
        bytes32 listingId;
        address supplier;
        uint256 orderValueUsdc; // 6-decimal USDC
        uint256 supplierCostUsdc; // 6-decimal USDC
    }

    enum Decision {
        Cleared,
        PolicyBlocked,
        HumanApprovalRequired
    }

    mapping(address => bool) public verifiedSuppliers;
    address public owner;

    event SupplierStatusUpdated(address indexed supplier, bool verified);
    event PolicyEvaluated(
        bytes32 indexed orderId,
        Decision indexed decision,
        string reason,
        uint256 projectedMarginBps
    );

    error Unauthorized();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setSupplierStatus(address supplier, bool verified) external onlyOwner {
        verifiedSuppliers[supplier] = verified;
        emit SupplierStatusUpdated(supplier, verified);
    }

    /**
     * @notice Evaluates an order intent against the deterministic 5-step policy sequence.
     * @param intent The proposed order parameters.
     * @param config The organization's policy constraints.
     * @return decision Cleared (5/5 passed), PolicyBlocked, or HumanApprovalRequired.
     * @return reason Descriptive failure or escalation rationale.
     * @return marginBps Projected gross margin in basis points.
     */
    function evaluate(
        OrderIntent calldata intent,
        PolicyConfig calldata config
    ) external returns (Decision decision, string memory reason, uint256 marginBps) {
        // Step 1: Available to Spend Check
        if (intent.orderValueUsdc > config.availableToSpendUsdc) {
            decision = Decision.PolicyBlocked;
            reason = "EXCEEDS_AVAILABLE_SPEND";
            emit PolicyEvaluated(intent.orderId, decision, reason, 0);
            return (decision, reason, 0);
        }

        // Step 2: Reserved Liquidity Check
        if (config.totalBalanceUsdc < config.reservedLiquidityUsdc) {
            decision = Decision.PolicyBlocked;
            reason = "INSOLVENT_RESERVE_FLOOR";
            emit PolicyEvaluated(intent.orderId, decision, reason, 0);
            return (decision, reason, 0);
        }
        uint256 spendableBuffer = config.totalBalanceUsdc - config.reservedLiquidityUsdc;
        if (intent.supplierCostUsdc > spendableBuffer) {
            decision = Decision.PolicyBlocked;
            reason = "INSUFFICIENT_UNRESERVED_LIQUIDITY";
            emit PolicyEvaluated(intent.orderId, decision, reason, 0);
            return (decision, reason, 0);
        }

        // Step 3: Gross Margin Floor Check
        if (intent.orderValueUsdc <= intent.supplierCostUsdc) {
            decision = Decision.PolicyBlocked;
            reason = "NEGATIVE_OR_ZERO_MARGIN";
            emit PolicyEvaluated(intent.orderId, decision, reason, 0);
            return (decision, reason, 0);
        }
        uint256 profit = intent.orderValueUsdc - intent.supplierCostUsdc;
        marginBps = (profit * BPS_DENOMINATOR) / intent.orderValueUsdc;
        if (marginBps < config.grossMarginFloorBps) {
            decision = Decision.PolicyBlocked;
            reason = "MARGIN_BELOW_FLOOR";
            emit PolicyEvaluated(intent.orderId, decision, reason, marginBps);
            return (decision, reason, marginBps);
        }

        // Step 4: Supplier Verification Check
        if (!verifiedSuppliers[intent.supplier]) {
            decision = Decision.PolicyBlocked;
            reason = "UNVERIFIED_SUPPLIER";
            emit PolicyEvaluated(intent.orderId, decision, reason, marginBps);
            return (decision, reason, marginBps);
        }

        // Step 5: Auto-Approval Spending Threshold Check
        if (intent.orderValueUsdc > config.autoApprovalLimitUsdc) {
            decision = Decision.HumanApprovalRequired;
            reason = "EXCEEDS_AUTO_APPROVAL_THRESHOLD";
            emit PolicyEvaluated(intent.orderId, decision, reason, marginBps);
            return (decision, reason, marginBps);
        }

        // Cleared (5/5 Checks Passed)
        decision = Decision.Cleared;
        reason = "CLEARED";
        emit PolicyEvaluated(intent.orderId, decision, reason, marginBps);
        return (decision, reason, marginBps);
    }
}
