/**
 * Mercenta Primitives — Smart Contract ABIs
 * Human-readable and JSON ABIs for Viem / Ethers integration on Arc.
 */

export const MercentaCheckoutAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'merchantTreasury_', type: 'address' },
      { name: 'feeTreasury_', type: 'address' },
      { name: 'platformFeeBps_', type: 'uint256' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'placeOrder',
    inputs: [
      { name: 'orderId', type: 'bytes32' },
      { name: 'supplier', type: 'address' },
      { name: 'totalAmountUsdc', type: 'uint256' },
      { name: 'productReference', type: 'string' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'processedOrders',
    inputs: [{ name: '', type: 'bytes32' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'merchantTreasury',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'feeTreasury',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'platformFeeBps',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'OrderPlaced',
    inputs: [
      { name: 'orderId', type: 'bytes32', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'supplier', type: 'address', indexed: true },
      { name: 'totalAmountUsdc', type: 'uint256', indexed: false },
      { name: 'netSupplierAmountUsdc', type: 'uint256', indexed: false },
      { name: 'feeAmountUsdc', type: 'uint256', indexed: false },
      { name: 'productReference', type: 'string', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'CircuitBreakerToggled',
    inputs: [{ name: 'isPaused', type: 'bool', indexed: false }],
    anonymous: false
  }
] as const;

export const PolicyEngineAbi = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'evaluate',
    inputs: [
      {
        name: 'intent',
        type: 'tuple',
        components: [
          { name: 'orderId', type: 'bytes32' },
          { name: 'listingId', type: 'bytes32' },
          { name: 'supplier', type: 'address' },
          { name: 'orderValueUsdc', type: 'uint256' },
          { name: 'supplierCostUsdc', type: 'uint256' }
        ]
      },
      {
        name: 'config',
        type: 'tuple',
        components: [
          { name: 'availableToSpendUsdc', type: 'uint256' },
          { name: 'reservedLiquidityUsdc', type: 'uint256' },
          { name: 'totalBalanceUsdc', type: 'uint256' },
          { name: 'grossMarginFloorBps', type: 'uint256' },
          { name: 'autoApprovalLimitUsdc', type: 'uint256' }
        ]
      }
    ],
    outputs: [
      { name: 'decision', type: 'uint8' },
      { name: 'reason', type: 'string' },
      { name: 'projectedMarginBps', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'verifiedSuppliers',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'setSupplierStatus',
    inputs: [
      { name: 'supplier', type: 'address' },
      { name: 'verified', type: 'bool' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    name: 'PolicyEvaluated',
    inputs: [
      { name: 'orderId', type: 'bytes32', indexed: true },
      { name: 'decision', type: 'uint8', indexed: true },
      { name: 'reason', type: 'string', indexed: false },
      { name: 'projectedMarginBps', type: 'uint256', indexed: false }
    ],
    anonymous: false
  }
] as const;

export const AgentTreasuryVaultAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'agentOperator_', type: 'address' },
      { name: 'dailySpendingCapUsdc_', type: 'uint256' },
      { name: 'perOrderCeilingUsdc_', type: 'uint256' },
      { name: 'reservedFloorUsdc_', type: 'uint256' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'disburseOrder',
    inputs: [
      { name: 'orderId', type: 'bytes32' },
      { name: 'destination', type: 'address' },
      { name: 'amountUsdc', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'queueEscalation',
    inputs: [
      { name: 'orderId', type: 'bytes32' },
      { name: 'destination', type: 'address' },
      { name: 'amountUsdc', type: 'uint256' },
      { name: 'reason', type: 'string' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'approveAndExecuteEscalation',
    inputs: [{ name: 'orderId', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'getAvailableSpend',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'AgentDisbursed',
    inputs: [
      { name: 'orderId', type: 'bytes32', indexed: true },
      { name: 'destination', type: 'address', indexed: true },
      { name: 'amountUsdc', type: 'uint256', indexed: false }
    ],
    anonymous: false
  }
] as const;

export const Erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  }
] as const;
