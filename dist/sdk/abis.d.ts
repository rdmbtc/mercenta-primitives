/**
 * Mercenta Primitives — Smart Contract ABIs
 * Human-readable and JSON ABIs for Viem / Ethers integration on Arc.
 */
export declare const MercentaCheckoutAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "merchantTreasury_";
        readonly type: "address";
    }, {
        readonly name: "feeTreasury_";
        readonly type: "address";
    }, {
        readonly name: "platformFeeBps_";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "placeOrder";
    readonly inputs: readonly [{
        readonly name: "orderId";
        readonly type: "bytes32";
    }, {
        readonly name: "supplier";
        readonly type: "address";
    }, {
        readonly name: "totalAmountUsdc";
        readonly type: "uint256";
    }, {
        readonly name: "productReference";
        readonly type: "string";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "processedOrders";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "paused";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "merchantTreasury";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "feeTreasury";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "platformFeeBps";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "OrderPlaced";
    readonly inputs: readonly [{
        readonly name: "orderId";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "buyer";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "supplier";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "totalAmountUsdc";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "netSupplierAmountUsdc";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "feeAmountUsdc";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "productReference";
        readonly type: "string";
        readonly indexed: false;
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "CircuitBreakerToggled";
    readonly inputs: readonly [{
        readonly name: "isPaused";
        readonly type: "bool";
        readonly indexed: false;
    }];
    readonly anonymous: false;
}];
export declare const PolicyEngineAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "evaluate";
    readonly inputs: readonly [{
        readonly name: "intent";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "orderId";
            readonly type: "bytes32";
        }, {
            readonly name: "listingId";
            readonly type: "bytes32";
        }, {
            readonly name: "supplier";
            readonly type: "address";
        }, {
            readonly name: "orderValueUsdc";
            readonly type: "uint256";
        }, {
            readonly name: "supplierCostUsdc";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "config";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "availableToSpendUsdc";
            readonly type: "uint256";
        }, {
            readonly name: "reservedLiquidityUsdc";
            readonly type: "uint256";
        }, {
            readonly name: "totalBalanceUsdc";
            readonly type: "uint256";
        }, {
            readonly name: "grossMarginFloorBps";
            readonly type: "uint256";
        }, {
            readonly name: "autoApprovalLimitUsdc";
            readonly type: "uint256";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "decision";
        readonly type: "uint8";
    }, {
        readonly name: "reason";
        readonly type: "string";
    }, {
        readonly name: "projectedMarginBps";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "verifiedSuppliers";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "setSupplierStatus";
    readonly inputs: readonly [{
        readonly name: "supplier";
        readonly type: "address";
    }, {
        readonly name: "verified";
        readonly type: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "PolicyEvaluated";
    readonly inputs: readonly [{
        readonly name: "orderId";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "decision";
        readonly type: "uint8";
        readonly indexed: true;
    }, {
        readonly name: "reason";
        readonly type: "string";
        readonly indexed: false;
    }, {
        readonly name: "projectedMarginBps";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly anonymous: false;
}];
export declare const AgentTreasuryVaultAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "agentOperator_";
        readonly type: "address";
    }, {
        readonly name: "dailySpendingCapUsdc_";
        readonly type: "uint256";
    }, {
        readonly name: "perOrderCeilingUsdc_";
        readonly type: "uint256";
    }, {
        readonly name: "reservedFloorUsdc_";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "disburseOrder";
    readonly inputs: readonly [{
        readonly name: "orderId";
        readonly type: "bytes32";
    }, {
        readonly name: "destination";
        readonly type: "address";
    }, {
        readonly name: "amountUsdc";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "queueEscalation";
    readonly inputs: readonly [{
        readonly name: "orderId";
        readonly type: "bytes32";
    }, {
        readonly name: "destination";
        readonly type: "address";
    }, {
        readonly name: "amountUsdc";
        readonly type: "uint256";
    }, {
        readonly name: "reason";
        readonly type: "string";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "approveAndExecuteEscalation";
    readonly inputs: readonly [{
        readonly name: "orderId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getAvailableSpend";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "AgentDisbursed";
    readonly inputs: readonly [{
        readonly name: "orderId";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "destination";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "amountUsdc";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly anonymous: false;
}];
export declare const Erc20Abi: readonly [{
    readonly type: "function";
    readonly name: "balanceOf";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "transfer";
    readonly inputs: readonly [{
        readonly name: "recipient";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "approve";
    readonly inputs: readonly [{
        readonly name: "spender";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "allowance";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "spender";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}];
//# sourceMappingURL=abis.d.ts.map