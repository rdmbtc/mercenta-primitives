/**
 * Mercenta Primitives — Arc Onramp Kit
 * Tooling for onboarding fiat and cross-chain capital directly into Arc USDC.
 */

import { ARC_MAINNET_CHAIN_ID, CONTRACT_ADDRESSES } from './constants.js';

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
export function buildArcOnrampUrl(options: OnrampOptions): string {
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
export function getCrossChainCctpConfig(sourceChain: CrossChainBridgeParams['sourceChain']) {
  const domains: Record<string, number> = {
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
    tokenMessengerMainnet: '0xbd3fa81b58ba92a82136038b25adec7066af3155' as const
  };
}
