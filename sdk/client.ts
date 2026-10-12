/**
 * Mercenta Primitives — Unified High-Level Client
 * Viem-powered SDK for autonomous agents, merchants, and developer integrations on Arc.
 */

import {
  createPublicClient,
  http,
  type PublicClient,
  type WalletClient,
  parseAbiItem
} from 'viem';
import {
  CONTRACT_ADDRESSES,
  arcMainnet,
  arcTestnet,
  DEFAULT_POLICY_MARGIN_FLOOR_BPS,
  DEFAULT_AUTO_APPROVAL_LIMIT_USDC
} from './constants.js';
import {
  evaluatePolicy,
  type OrderIntent,
  type PolicyConfig,
  type EvaluationResult
} from './PolicyGate.js';
import { MercentaCheckoutAbi, Erc20Abi } from './abis.js';
import {
  parseX402Response,
  buildX402Headers,
  prepareX402CheckoutCall,
  type X402PaymentChallenge,
  type X402FulfillmentResult
} from './x402.js';
import { buildArcOnrampUrl, type OnrampOptions } from './onramp.js';

export interface MercentaClientConfig {
  network?: 'mainnet' | 'testnet';
  rpcUrl?: string;
  defaultPolicy?: Partial<PolicyConfig>;
}

export class MercentaClient {
  public readonly network: 'mainnet' | 'testnet';
  public readonly publicClient: PublicClient;
  public readonly contractAddresses: typeof CONTRACT_ADDRESSES['mainnet'];
  private readonly defaultPolicyConfig: PolicyConfig;

  constructor(config: MercentaClientConfig = {}) {
    this.network = config.network || 'mainnet';
    const chain = this.network === 'mainnet' ? arcMainnet : arcTestnet;
    const rpc = config.rpcUrl || (this.network === 'mainnet' ? arcMainnet.rpcUrls.default.http[0] : arcTestnet.rpcUrls.default.http[0]);

    this.contractAddresses = this.network === 'mainnet' ? CONTRACT_ADDRESSES.mainnet : (CONTRACT_ADDRESSES.testnet as any);

    this.publicClient = createPublicClient({
      chain,
      transport: http(rpc)
    });

    this.defaultPolicyConfig = {
      availableToSpendUsdc: config.defaultPolicy?.availableToSpendUsdc ?? 10_000_000000n,
      reservedLiquidityUsdc: config.defaultPolicy?.reservedLiquidityUsdc ?? 2_000_000000n,
      totalBalanceUsdc: config.defaultPolicy?.totalBalanceUsdc ?? 12_000_000000n,
      grossMarginFloorBps: config.defaultPolicy?.grossMarginFloorBps ?? DEFAULT_POLICY_MARGIN_FLOOR_BPS,
      autoApprovalLimitUsdc: config.defaultPolicy?.autoApprovalLimitUsdc ?? DEFAULT_AUTO_APPROVAL_LIMIT_USDC,
      verifiedSuppliers: config.defaultPolicy?.verifiedSuppliers ?? new Set([this.contractAddresses.mercentaCheckout.toLowerCase()])
    };
  }

  /**
   * Evaluates an agent order intent against the 5-step deterministic policy engine.
   */
  public evaluate(intent: OrderIntent, overrideConfig?: Partial<PolicyConfig>): EvaluationResult {
    const config = overrideConfig ? { ...this.defaultPolicyConfig, ...overrideConfig } : this.defaultPolicyConfig;
    return evaluatePolicy(intent, config);
  }

  /**
   * Checks whether an order has been settled and recorded on Arc.
   */
  public async isOrderSettled(orderId: `0x${string}`): Promise<boolean> {
    const isProcessed = await this.publicClient.readContract({
      address: this.contractAddresses.mercentaCheckout,
      abi: MercentaCheckoutAbi,
      functionName: 'processedOrders',
      args: [orderId]
    });
    return isProcessed as boolean;
  }

  /**
   * Reads the on-chain USDC balance for any account on Arc.
   */
  public async getUsdcBalance(accountAddress: `0x${string}`): Promise<bigint> {
    const balance = await this.publicClient.readContract({
      address: this.contractAddresses.usdc,
      abi: Erc20Abi,
      functionName: 'balanceOf',
      args: [accountAddress]
    });
    return balance as bigint;
  }

  /**
   * Generates a direct fiat-to-Arc USDC onramp URL.
   */
  public getOnrampUrl(options: Omit<OnrampOptions, 'network'>): string {
    return buildArcOnrampUrl({
      ...options,
      network: this.network
    });
  }

  /**
   * Requests an x402 purchase challenge from the Mercenta API gateway.
   */
  public async requestX402Challenge(apiEndpoint: string, orderData: {
    productId: string;
    recipient: string;
    units?: number;
  }): Promise<X402PaymentChallenge> {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (response.status === 402) {
      return parseX402Response(response);
    }

    throw new Error(`Expected HTTP 402, received status ${response.status}`);
  }

  /**
   * Submits an on-chain payment proof to fulfill an x402 order challenge.
   */
  public async fulfillX402Order(apiEndpoint: string, params: {
    txHash: string;
    orderId: string;
    agentId?: string;
  }): Promise<X402FulfillmentResult> {
    const headers = buildX402Headers(params);
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        orderId: params.orderId,
        txHash: params.txHash
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`x402 fulfillment failed (${response.status}): ${err}`);
    }

    return (await response.json()) as X402FulfillmentResult;
  }
}
