/**
 * Mercenta Primitives — Network & Contract Constants
 * Arc Mainnet & Testnet configuration for Viem and Agent SDKs.
 */
export declare const ARC_MAINNET_CHAIN_ID = 5042;
export declare const ARC_TESTNET_CHAIN_ID = 5042002;
export declare const ARC_MAINNET_RPC = "https://rpc.arc.io";
export declare const ARC_TESTNET_RPC = "https://rpc.testnet.arc.io";
export declare const ARC_MAINNET_EXPLORER = "https://explorer.arc.io";
export declare const ARC_TESTNET_EXPLORER = "https://testnet.arcscan.app";
export declare const ARC_MAINNET_USDC: "0x3600000000000000000000000000000000000000";
export declare const ARC_TESTNET_USDC: "0x5042002000000000000000000000000000000000";
export declare const CONTRACT_ADDRESSES: {
    readonly mainnet: {
        readonly mercentaCheckout: `0x${string}`;
        readonly usdc: "0x3600000000000000000000000000000000000000";
        readonly chainId: 5042;
        readonly rpcUrl: "https://rpc.arc.io";
    };
    readonly testnet: {
        readonly mercentaCheckout: `0x${string}`;
        readonly usdc: "0x5042002000000000000000000000000000000000";
        readonly chainId: 5042002;
        readonly rpcUrl: "https://rpc.testnet.arc.io";
    };
};
export declare const arcMainnet: {
    blockExplorers: {
        readonly default: {
            readonly name: "Arc Explorer";
            readonly url: "https://explorer.arc.io";
        };
    };
    blockTime?: number | undefined | undefined;
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        erc6492Verifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 5042;
    name: "Arc Mainnet";
    nativeCurrency: {
        readonly name: "USDC";
        readonly symbol: "USDC";
        readonly decimals: 6;
    };
    experimental_preconfirmationTime?: number | undefined | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.arc.io"];
        };
    };
    sourceId?: number | undefined | undefined;
    supportsTransactionReplacementDetection?: boolean | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    extendSchema?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    prepareTransactionRequest?: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        client: import("viem").Client;
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | [fn: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        client: import("viem").Client;
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | undefined, options: {
        runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
    }] | undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
    verifyHash?: ((client: import("viem").Client, parameters: import("viem").VerifyHashActionParameters) => Promise<import("viem").VerifyHashActionReturnType>) | undefined;
};
export declare const arcTestnet: {
    blockExplorers: {
        readonly default: {
            readonly name: "ArcScan Testnet";
            readonly url: "https://testnet.arcscan.app";
        };
    };
    blockTime?: number | undefined | undefined;
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        erc6492Verifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 5042002;
    name: "Arc Testnet";
    nativeCurrency: {
        readonly name: "USDC";
        readonly symbol: "USDC";
        readonly decimals: 6;
    };
    experimental_preconfirmationTime?: number | undefined | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.testnet.arc.io"];
        };
    };
    sourceId?: number | undefined | undefined;
    supportsTransactionReplacementDetection?: boolean | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    extendSchema?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    prepareTransactionRequest?: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        client: import("viem").Client;
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | [fn: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        client: import("viem").Client;
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | undefined, options: {
        runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
    }] | undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
    verifyHash?: ((client: import("viem").Client, parameters: import("viem").VerifyHashActionParameters) => Promise<import("viem").VerifyHashActionReturnType>) | undefined;
};
export declare const DEFAULT_POLICY_MARGIN_FLOOR_BPS = 1500n;
export declare const DEFAULT_AUTO_APPROVAL_LIMIT_USDC = 5000000000n;
//# sourceMappingURL=constants.d.ts.map