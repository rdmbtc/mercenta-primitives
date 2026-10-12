/**
 * Mercenta Primitives — Circle Agent Stack & x402 Micropayments Protocol
 * HTTP 402 Payment Required integration for autonomous agents purchasing on Arc.
 */
export interface X402PaymentChallenge {
    error: string;
    protocol: 'x402';
    challenge: {
        orderId: string;
        productReference: string;
        amountUnits: string;
        amountUsdc: string;
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
export declare function parseX402Response(response: Response): Promise<X402PaymentChallenge>;
/**
 * Generates HTTP headers for executing an x402 purchase request with payment proof.
 */
export declare function buildX402Headers(params: {
    txHash: string;
    orderId: string;
    agentId?: string;
}): Record<string, string>;
/**
 * Evaluates an incoming x402 response, prepares the transaction call parameters
 * for MercentaCheckout.sol, and formats execution data for Viem wallet clients.
 */
export declare function prepareX402CheckoutCall(challenge: X402PaymentChallenge['challenge']): {
    address: `0x${string}`;
    chainId: number;
    functionName: string;
    args: readonly [`0x${string}`, `0x${string}`, bigint, string];
    amountUnits: bigint;
    token: `0x${string}`;
};
//# sourceMappingURL=x402.d.ts.map