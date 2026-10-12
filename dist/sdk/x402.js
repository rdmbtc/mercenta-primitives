/**
 * Mercenta Primitives — Circle Agent Stack & x402 Micropayments Protocol
 * HTTP 402 Payment Required integration for autonomous agents purchasing on Arc.
 */
/**
 * Parses an HTTP 402 response from Mercenta API into a typed X402PaymentChallenge.
 */
export async function parseX402Response(response) {
    if (response.status !== 402) {
        throw new Error(`Expected HTTP 402 Payment Required, received status ${response.status}`);
    }
    const body = await response.json();
    if (body.protocol !== 'x402' || !body.challenge) {
        throw new Error('Invalid x402 response format from settlement gateway.');
    }
    return body;
}
/**
 * Generates HTTP headers for executing an x402 purchase request with payment proof.
 */
export function buildX402Headers(params) {
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
export function prepareX402CheckoutCall(challenge) {
    return {
        address: challenge.recipient,
        chainId: challenge.chainId,
        functionName: 'placeOrder',
        args: [
            challenge.orderId,
            challenge.recipient,
            BigInt(challenge.amountUnits),
            challenge.productReference
        ],
        amountUnits: BigInt(challenge.amountUnits),
        token: challenge.tokenAddress
    };
}
//# sourceMappingURL=x402.js.map