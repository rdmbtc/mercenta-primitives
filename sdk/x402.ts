/**
 * Mercenta Primitives — Circle Agent Stack & x402 Micropayments Protocol
 * HTTP 402 Payment Required integration for autonomous agents purchasing on Arc.
 */

import { CONTRACT_ADDRESSES, ARC_MAINNET_CHAIN_ID } from './constants.js';

export interface X402PaymentChallenge {
  error: string;
  protocol: 'x402';
  challenge: {
    orderId: string;
    productReference: string;
    amountUnits: string; // 6-decimal micro-USDC (e.g. "1000000" for 1 USDC)
    amountUsdc: string;  // Formatted string (e.g. "1.000000")
    currency: 'USDC';
    chainId: number;
    chainName: string;
    recipient: `0x${string}`;
    tokenAddress: `0x${string}`;
    challengeNonce: string;
    expiresAt: string;
    instructions: string;
  };
}

export interface X402FulfillmentResult {
  status: 'fulfilled' | 'pending' | 'rejected';
  orderId: string;
  txHash: string;
  receiptId: string;
  product: string;
  itemCode?: string;
  delivery: {
    type: 'instant_voucher' | 'api_credential' | 'subscription_token' | 'license_key';
    payload: string;
  };
  blockNumber?: number;
  confirmedAt: string;
}

/**
 * Parses an HTTP 402 response from Mercenta API into a typed X402PaymentChallenge.
 */
export async function parseX402Response(response: Response): Promise<X402PaymentChallenge> {
  if (response.status !== 402) {
    throw new Error(`Expected HTTP 402 Payment Required, received status ${response.status}`);
  }
  const body = await response.json();
  if (body.protocol !== 'x402' || !body.challenge) {
    throw new Error('Invalid x402 response format from settlement gateway.');
  }
  return body as X402PaymentChallenge;
}

/**
 * Generates HTTP headers for executing an x402 purchase request with payment proof.
 */
export function buildX402Headers(params: {
  txHash: string;
  orderId: string;
  agentId?: string;
}): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Payment-Protocol': 'x402',
    'X-Payment-Tx': params.txHash,
    'X-Payment-OrderId': params.orderId,
    ...(params.agentId ? { 'X-Agent-Identifier': params.agentId } : {})
  };
}

/**
 * Evaluates an incoming x402 response, prepares the transaction call parameters
 * for MercentaCheckout.sol, and formats execution data for Viem wallet clients.
 */
export function prepareX402CheckoutCall(challenge: X402PaymentChallenge['challenge']) {
  return {
    address: challenge.recipient,
    chainId: challenge.chainId,
    functionName: 'placeOrder',
    args: [
      challenge.orderId as `0x${string}`,
      challenge.recipient,
      BigInt(challenge.amountUnits),
      challenge.productReference
    ] as const,
    amountUnits: BigInt(challenge.amountUnits),
    token: challenge.tokenAddress
  };
}
