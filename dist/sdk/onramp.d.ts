/**
 * Mercenta Primitives — Arc Onramp Kit
 * Tooling for onboarding fiat and cross-chain capital directly into Arc USDC.
 */
export interface OnrampOptions {
    walletAddress: `0x${string}` | string;
    amountUsdc?: number | string;
    fiatCurrency?: 'USD' | 'EUR' | 'GBP';
    network?: 'mainnet' | 'testnet';
    redirectUrl?: string;
    partnerId?: string;
}
export interface CrossChainBridgeParams {
    sourceChain: 'ethereum' | 'base' | 'arbitrum' | 'solana' | 'polygon';
    destinationChain: 'arc';
    amountUsdc: string;
    recipientAddress: `0x${string}` | string;
}
/**
 * Builds a direct fiat-to-Arc USDC onramp URL for the user's wallet.
 */
export declare function buildArcOnrampUrl(options: OnrampOptions): string;
/**
 * Circle CCTP V2 & Gateway bridge route configuration for Arc.
 */
export declare function getCrossChainCctpConfig(sourceChain: CrossChainBridgeParams['sourceChain']): {
    sourceDomain: number;
    destinationDomain: number;
    destinationChainId: number;
    irisAttestationApi: string;
    tokenMessengerMainnet: "0xbd3fa81b58ba92a82136038b25adec7066af3155";
};
//# sourceMappingURL=onramp.d.ts.map