---
name: mercenta-commerce
description: Launch, automate, and operate an institutional digital goods business on Arc with the deterministic 5-step Policy Engine, multi-marketplace inventory feeds (G2G, FunPay, GGsel), and Circle Agent Stack settlements.
---

# Mercenta Commerce: Autonomous Agent Digital Goods Business Guide

This skill guides AI agents and developers in launching and operating an autonomous, profitable digital goods business on the **Arc blockchain** using **Mercenta Primitives**.

---

## 🏛️ 1. Core Architecture: The 5-Step Policy Engine

In autonomous commerce, **"a model proposes — it never authorises."**  
When an AI agent manages an inventory or treasury, probabilistic LLM decisions must be constrained by deterministic mathematical guardrails before any on-chain USDC transfer occurs.

```
                    ┌────────────────────────────┐
                    │ External Merchant Feeds    │
                    │  (G2G, FunPay, GGsel, API) │
                    └─────────────┬──────────────┘
                                  │ Catalog Ingestion
                                  ▼
                    ┌────────────────────────────┐
                    │ Agent Evaluates Request    │
                    └─────────────┬──────────────┘
                                  │ Order Intent
                                  ▼
      ┌────────────────────────────────────────────────────────┐
      │          Deterministic 5-Step Policy Engine            │
      │                                                        │
      │  [1] Available Spend Cap       (Under monthly limit?)  │
      │  [2] Reserved Liquidity Floor  (Protects float buffer) │
      │  [3] Gross Margin Floor        (Margin >= 15.0%?)      │
      │  [4] Supplier Verification     (Verified catalog SLA?) │
      │  [5] Auto-Approval Ceiling     (Routine vs Escalated)  │
      └───────────────────────────┬────────────────────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
        [Policy Cleared]               [Human Escalation]
                  │                               │
                  ▼                               ▼
       Arc Mainnet Settlement            Admin Approval Queue
       (MercentaCheckout.sol)                     │
                  │                               ▼
                  ▼                      Execute / Reject
       Cryptographic Receipt
```

---

## 📦 2. Multi-Marketplace Catalog Ingestion

Agents can ingest inventory feeds from leading digital goods platforms (G2G, FunPay, GGsel, wholesale publishers) and expose them under institutional Mercenta categories:

### Allowed Categories:
1. **Gaming Keys & Platform Vouchers**: Steam, PlayStation, Xbox, Epic Games, Nintendo, Riot, Blizzard.
2. **Streaming & Media Subscriptions**: Spotify, Netflix, YouTube Premium, Discord Nitro, Crunchyroll.
3. **Creator & Game Micro-Donations**: Telegram Stars, Twitch Bits, Roblox Robux vouchers.
4. **Developer API & Token Bundles**: Prepaid AI compute credits, API token pool allocations.
5. **Cloud Compute & GPU Vouchers**: Dedicated GPU hours (H100, A100 reservations).

> [!CAUTION]
> **Prohibited Items Policy**: Personal accounts, auto-registered profiles, and email mailboxes are strictly prohibited. Any listing containing keywords such as "account", "аккаунт", or "email" must be filtered during ingestion.

---

## ⚙️ 3. Implementing the 5-Step Policy in TypeScript

Using `mercenta-primitives` (or `@mercenta/sdk`):

```typescript
import { evaluatePolicy, type OrderIntent, type PolicyConfig } from 'mercenta-primitives';

// 1. Define enterprise policy constraints
const businessPolicy: PolicyConfig = {
  availableToSpendUsdc: 5_000_000000n, // $5,000.00 USDC spend allowance
  reservedLiquidityUsdc: 1_000_000000n, // $1,000.00 USDC untouchable operational reserve
  totalBalanceUsdc: 7_500_000000n,     // $7,500.00 USDC current treasury balance
  grossMarginFloorBps: 1500n,          // 15.0% minimum gross margin floor
  autoApprovalLimitUsdc: 250_000000n,  // Orders above $250.00 USDC require human review
  verifiedSuppliers: new Set([
    '0x06b67adf8d63c8c35a6beda42a3bb93d485af3ed'.toLowerCase(),
    '0x58863e4a739da0e62c2eba258b7783e95d5c48ce'.toLowerCase()
  ])
};

// 2. Prepare incoming order intent (e.g. from G2G/FunPay customer order)
const orderIntent: OrderIntent = {
  orderId: '0x' + crypto.randomUUID().replace(/-/g, '') + '00000000000000000000000000000000',
  listingId: 'STEAM-WALLET-50-GLOBAL',
  supplier: '0x06b67adf8d63c8c35a6beda42a3bb93d485af3ed',
  orderValueUsdc: 50_000000n,  // Retail price charged to customer
  supplierCostUsdc: 42_000000n, // Wholesale cost (16.0% margin)
  category: 'gaming',
  region: 'GLOBAL'
};

// 3. Evaluate deterministic policy
const result = evaluatePolicy(orderIntent, businessPolicy);

if (result.decision === 'Cleared') {
  console.log(`✅ Order cleared with ${result.marginPercent} margin. Executing settlement on Arc...`);
} else if (result.decision === 'HumanApprovalRequired') {
  console.log(`⚠️ Escalated to owner review: ${result.reason}`);
} else {
  console.error(`🛑 Policy blocked: ${result.reason}`);
}
```

---

## ⚡ 4. Circle Agent Stack & HTTP 402 Purchases

Mercenta supports the **HTTP 402 Payment Required** standard, allowing users to simply instruct their autonomous agent:  
*"Agent, buy 100 Telegram Stars for my channel"* or *"Buy a 20 USDC Steam card."*

### Flow:
1. **Agent Quote Request**:
   ```bash
   POST https://mainnet.mercenta.xyz/api/x402/order
   { "productId": "telegram-stars-100", "recipient": "user@t.me" }
   ```
2. **Gateway Response (`402 Payment Required`)**:
   ```json
   {
     "error": "Payment Required",
     "protocol": "x402",
     "challenge": {
       "orderId": "0x123...",
       "amountUnits": "1990000",
       "amountUsdc": "1.990000",
       "chainId": 5042,
       "recipient": "0x06b67adf8d63c8c35a6beda42a3bb93d485af3ed",
       "tokenAddress": "0x3600000000000000000000000000000000000000"
     }
   }
   ```
3. **Agent Pays On Arc**:
   Using Circle Gateway or Arc Viem client, the agent transfers 1.990000 USDC.
4. **Agent Resubmits with Proof**:
   ```bash
   POST https://mainnet.mercenta.xyz/api/x402/order
   Header: X-Payment-Tx: 0xabc...
   Header: X-Payment-OrderId: 0x123...
   ```
5. **Instant Release**:
   The activation voucher is released immediately in the 200 OK JSON response.

---

## 💳 5. Onramp Kit Integration

For onboarding customers without native Arc USDC:
- Use `buildArcOnrampUrl({ walletAddress, amountUsdc, fiatCurrency: 'USD' })`
- Directs users to the hosted onramp interface at `https://mainnet.mercenta.xyz/onramp`
- Supports Circle Cross-Chain Transfer Protocol (CCTP) to bridge USDC seamlessly from Base, Arbitrum, Ethereum, or Solana into Arc.
