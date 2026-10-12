/**
 * Mercenta Primitives — Unified High-Level Client
 * Viem-powered SDK for autonomous agents, merchants, and developer integrations on Arc.
 */
import { type PublicClient } from 'viem';
import { CONTRACT_ADDRESSES } from './constants.js';
import { type OrderIntent, type PolicyConfig, type EvaluationResult } from './PolicyGate.js';
import { type X402PaymentChallenge, type X402FulfillmentResult } from './x402.js';
import { type OnrampOptions } from './onramp.js';
export interface MercentaClientConfig {
    network?: 'mainnet' | 'testnet';
    rpcUrl?: string;
    defaultPolicy?: Partial<PolicyConfig>;
}
export declare class MercentaClient {
    readonly network: 'mainnet' | 'testnet';
    readonly publicClient: PublicClient;
    readonly contractAddresses: typeof CONTRACT_ADDRESSES['mainnet'];
    private readonly defaultPolicyConfig;
    constructor(config?: MercentaClientConfig);
    /**
     * Evaluates an agent order intent against the 5-step deterministic policy engine.
     */
    evaluate(intent: OrderIntent, overrideConfig?: Partial<PolicyConfig>): EvaluationResult;
    /**
     * Checks whether an order has been settled and recorded on Arc.
     */
    isOrderSettled(orderId: `0x${string}`): Promise<boolean>;
    /**
     * Reads the on-chain USDC balance for any account on Arc.
     */
    getUsdcBalance(accountAddress: `0x${string}`): Promise<bigint>;
    /**
     * Generates a direct fiat-to-Arc USDC onramp URL.
     */
    getOnrampUrl(options: Omit<OnrampOptions, 'network'>): string;
    /**
     * Requests an x402 purchase challenge from the Mercenta API gateway.
     */
    requestX402Challenge(apiEndpoint: string, orderData: {
        productId: string;
        recipient: string;
        units?: number;
    }): Promise<X402PaymentChallenge>;
    /**
     * Submits an on-chain payment proof to fulfill an x402 order challenge.
     */
    fulfillX402Order(apiEndpoint: string, params: {
        txHash: string;
        orderId: string;
        agentId?: string;
    }): Promise<X402FulfillmentResult>;
}
//# sourceMappingURL=client.d.ts.map