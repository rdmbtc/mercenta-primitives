/**
 * Mercenta Primitives — Arc Onramp Kit
 * Tooling for onboarding fiat and cross-chain capital directly into Arc USDC.
 */
import { ARC_MAINNET_CHAIN_ID } from './constants.js';
/**
 * Builds a direct fiat-to-Arc USDC onramp URL for the user's wallet.
 */
export function buildArcOnrampUrl(options) {
    const isTestnet = options.network === 'testnet';
    const baseUrl = isTestnet
        ? 'https://testnet.mercenta.xyz/onramp'
        : 'https://mainnet.mercenta.xyz/onramp';
    const params = new URLSearchParams();
    params.set('address', options.walletAddress);
    params.set('currency', options.fiatCurrency || 'USD');
    params.set('network', isTestnet ? 'arc-testnet' : 'arc-mainnet');
    if (options.amountUsdc) {
        params.set('amount', options.amountUsdc.toString());
    }
    if (options.redirectUrl) {
        params.set('redirect', options.redirectUrl);
    }
    if (options.partnerId) {
        params.set('partner', options.partnerId);
    }
    return `${baseUrl}?${params.toString()}`;
}
/**
 * Circle CCTP V2 & Gateway bridge route configuration for Arc.
 */
export function getCrossChainCctpConfig(sourceChain) {
    const domains = {
        ethereum: 0,
        base: 6,
        arbitrum: 3,
        polygon: 7,
        solana: 5
    };
    return {
        sourceDomain: domains[sourceChain] ?? 0,
        destinationDomain: 5042, // Arc Malachite Domain
        destinationChainId: ARC_MAINNET_CHAIN_ID,
        irisAttestationApi: 'https://iris.circle.com/v1/attestations',
        tokenMessengerMainnet: '0xbd3fa81b58ba92a82136038b25adec7066af3155'
    };
}
//# sourceMappingURL=onramp.js.map