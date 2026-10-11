// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "./MercentaCheckout.sol";

/**
 * @title AgentTreasuryVault
 * @notice Non-custodial enterprise treasury vault for autonomous AI agents.
 * @dev Enforces daily spending caps, per-order ceilings, and reserved liquidity floors.
 */
contract AgentTreasuryVault {
    address public constant CANONICAL_USDC = 0x3600000000000000000000000000000000000000;

    address public owner;
    address public agentOperator;
    uint256 public dailySpendingCapUsdc; // 6-decimal USDC
    uint256 public perOrderCeilingUsdc; // 6-decimal USDC
    uint256 public reservedFloorUsdc; // 6-decimal USDC

    uint256 public currentDay;
    uint256 public spentTodayUsdc;

    struct EscalatedOrder {
        bytes32 orderId;
        address destination;
        uint256 amountUsdc;
        string reason;
        bool approved;
        bool executed;
    }

    mapping(bytes32 => EscalatedOrder) public escalations;

    event AgentOperatorUpdated(address indexed newOperator);
    event LimitsConfigured(uint256 dailyCap, uint256 perOrderCeiling, uint256 reservedFloor);
    event AgentDisbursed(bytes32 indexed orderId, address indexed destination, uint256 amountUsdc);
    event EscalationQueued(bytes32 indexed orderId, address indexed destination, uint256 amountUsdc, string reason);
    event EscalationApproved(bytes32 indexed orderId);

    error Unauthorized();
    error ExceedsPerOrderCeiling();
    error ExceedsDailyCap();
    error BelowReservedFloor();
    error EscalationNotFound();
    error AlreadyExecuted();
    error TransferFailed();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyAgentOrOwner() {
        if (msg.sender != agentOperator && msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor(
        address agentOperator_,
        uint256 dailySpendingCapUsdc_,
        uint256 perOrderCeilingUsdc_,
        uint256 reservedFloorUsdc_
    ) {
        owner = msg.sender;
        agentOperator = agentOperator_;
        dailySpendingCapUsdc = dailySpendingCapUsdc_;
        perOrderCeilingUsdc = perOrderCeilingUsdc_;
        reservedFloorUsdc = reservedFloorUsdc_;
    }

    function setAgentOperator(address agentOperator_) external onlyOwner {
        agentOperator = agentOperator_;
        emit AgentOperatorUpdated(agentOperator_);
    }

    function setLimits(
        uint256 dailyCap_,
        uint256 perOrderCeiling_,
        uint256 reservedFloor_
    ) external onlyOwner {
        dailySpendingCapUsdc = dailyCap_;
        perOrderCeilingUsdc = perOrderCeiling_;
        reservedFloorUsdc = reservedFloor_;
        emit LimitsConfigured(dailyCap_, perOrderCeiling_, reservedFloor_);
    }

    /**
     * @notice Allows an authorized agent operator to disburse funds if within bounds.
     */
    function disburse(
        bytes32 orderId,
        address destination,
        uint256 amountUsdc
    ) external onlyAgentOrOwner {
        if (amountUsdc > perOrderCeilingUsdc) revert ExceedsPerOrderCeiling();

        uint256 today = block.timestamp / 1 days;
        if (today != currentDay) {
            currentDay = today;
            spentTodayUsdc = 0;
        }

        if (spentTodayUsdc + amountUsdc > dailySpendingCapUsdc) revert ExceedsDailyCap();

        uint256 balance = IERC20(CANONICAL_USDC).balanceOf(address(this));
        if (balance < reservedFloorUsdc || balance - amountUsdc < reservedFloorUsdc) {
            revert BelowReservedFloor();
        }

        spentTodayUsdc += amountUsdc;

        if (!IERC20(CANONICAL_USDC).transfer(destination, amountUsdc)) revert TransferFailed();
        emit AgentDisbursed(orderId, destination, amountUsdc);
    }

    /**
     * @notice Enqueues an order that exceeded autonomous limits for human approval.
     */
    function queueEscalation(
        bytes32 orderId,
        address destination,
        uint256 amountUsdc,
        string calldata reason
    ) external onlyAgentOrOwner {
        escalations[orderId] = EscalatedOrder({
            orderId: orderId,
            destination: destination,
            amountUsdc: amountUsdc,
            reason: reason,
            approved: false,
            executed: false
        });
        emit EscalationQueued(orderId, destination, amountUsdc, reason);
    }

    /**
     * @notice Human-in-the-loop approval by treasury owner.
     */
    function approveAndExecuteEscalation(bytes32 orderId) external onlyOwner {
        EscalatedOrder storage order = escalations[orderId];
        if (order.amountUsdc == 0) revert EscalationNotFound();
        if (order.executed) revert AlreadyExecuted();

        order.approved = true;
        order.executed = true;

        if (!IERC20(CANONICAL_USDC).transfer(order.destination, order.amountUsdc)) revert TransferFailed();
        emit EscalationApproved(orderId);
    }
}
