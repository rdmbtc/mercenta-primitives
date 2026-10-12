<div align="center">
  <h1>🛡️ Mercenta Primitives</h1>
  <p><strong>A reusable agent-economy toolkit built for the Arc blockchain.</strong></p>

  <img src="https://img.shields.io/badge/Arc-000000?style=for-the-badge&logo=circle&logoColor=white" alt="Arc" />
  <img src="https://img.shields.io/badge/Foundry-FCC624?style=for-the-badge&logo=rust&logoColor=white" alt="Foundry" />
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
  <img src="https://img.shields.io/badge/Viem-FFB84C?style=for-the-badge&logo=javascript&logoColor=black" alt="Viem" />
  <img src="https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="NPM" />
</div>

<br />

Welcome to the open-source toolkit powering **Mercenta**. This repository contains the core, reusable smart contracts and infrastructure patterns designed explicitly for builders working on the **Arc Open Source Showcase**.

If you are building autonomous AI agents, multi-agent procurement rails, policy-controlled checkouts, or enterprise treasuries on Arc, you can fork, import, and ship on top of these primitives immediately.

---

## 📦 What primitives are we exposing?

We expose several key building blocks essential for agent commerce:

### 1. `PolicyEngine.sol` & TypeScript SDK: Deterministic 5-Step Policy Gate
In production agent commerce, **"a model proposes — it never authorises."**  
This primitive places an immutable 5-step gate between probabilistic model intent and on-chain treasury execution:
1. **Available Spend Check:** Enforces organizational spending allocations.
2. **Reserved Liquidity Floor:** Protects locked operational funds.
3. **Gross Margin Floor:** Halts orders with negative margins or hallucinated discounts (e.g. $\ge 15.0\%$).
4. **Supplier Verification:** Validates catalog authenticity and active SLAs.
5. **Auto-Approval Threshold:** Seamless execution under threshold; enqueues into Human-in-the-Loop review above it.

*(See `src/PolicyEngine.sol` and `sdk/PolicyGate.ts`)*

### 2. `MercentaCheckout.sol`: Production Arc Checkout Router
A non-upgradeable, battle-tested checkout router for autonomous agents and web users settled in **canonical 6-decimal USDC** on Arc:
- Sub-second Malachite block finality (< 500ms).
- Atomic merchant fee splitting and supplier routing in a single transaction.
- Single append-only receipts emitted via `OrderPlaced` events for finance reconciliation.
- Hardware-grade circuit breakers (`pause` / `unpause`).

*(Deployed and verified on Arc Mainnet: `0x06b67adf8d63c8c35a6beda42a3bb93d485af3ed`)*

### 3. `AgentTreasuryVault.sol`: Non-Custodial Agent Treasury Vault
A dedicated enterprise vault where autonomous agents draw from daily spending allowances and per-order ceilings while preserving locked reserves. High-value orders are safely escalated to owner approval.

### 4. Circle Agent Stack & x402 Micropayments
Built on and verified against Circle's agent-economy stack:
- **HTTP 402 Standard:** Agentic quote-and-pay endpoint (`sdk/x402.ts`). Users instruct their agent: *"Buy 100 Telegram Stars"*, and the agent automatically resolves the 402 challenge and settles via Arc USDC.
- **Nanopayments:** `@circle-fin/x402-batching` with Circle Gateway batched nanopayments.
- **Cross-Chain Ingestion:** CCTP V2 Iris attestation for cross-chain liquidity.
- **MPC Wallets:** User & developer-controlled 2-of-2 MPC agent wallets.

### 5. Arc Onramp Kit (`sdk/onramp.ts`)
Zero-friction onboarding for users and agents without native Arc USDC:
- Fiat-to-Arc USDC routing via hosted onramp.
- Circle Cross-Chain Transfer Protocol (CCTP) bridges from Base, Ethereum, Arbitrum, and Solana into Arc USDC.

### 6. Official Agent Skill (`skills/mercenta-commerce/SKILL.md`)
Turnkey skill for AI agents (Claude, GPT, Gemini, Cline, Roo, Antigravity) to bootstrap a multi-vendor digital goods store (G2G, FunPay, GGsel feeds) guarded by the 5-step Policy Engine.

---

## 🔵 Circle Agent Stack usage

| Layer | Circle Tool | Usage |
| --- | --- | --- |
| **Agent Micropayments** | `@circle-fin/x402-batching` | Nanopayment verification and settlement via Circle Gateway |
| **HTTP 402 Gateway** | `x402` standard | Autonomous agent conversational procurement rails |
| **Cross-chain Liquidity** | CCTP V2 + Iris | Seamless bridging from Ethereum Sepolia / Base into Arc USDC |
| **Production Reference** | Mercenta Live Console | Settles real agent checkouts on Arc Mainnet ([mainnet.mercenta.xyz/app](https://mainnet.mercenta.xyz/app)) |

---

## 🛠️ Installation & Usage

### Via NPM:

```bash
npm install mercenta-primitives
# or
npm install github:rdmbtc/mercenta-primitives
```

```typescript
import {
  MercentaClient,
  evaluatePolicy,
  CONTRACT_ADDRESSES,
  arcMainnet
} from 'mercenta-primitives';

// 1. Initialize Client
const client = new MercentaClient({ network: 'mainnet' });

// 2. Check Spendable Balance on Arc
const balance = await client.getUsdcBalance('0xYourWalletAddress...');
console.log(`USDC Balance: ${Number(balance) / 1e6}`);

// 3. Evaluate 5-Step Deterministic Policy Gate
const decision = client.evaluate({
  orderId: '0x1234...',
  listingId: 'STEAM-WALLET-50',
  supplier: CONTRACT_ADDRESSES.mainnet.mercentaCheckout,
  orderValueUsdc: 50_000000n, // $50.00 USDC
  supplierCostUsdc: 42_000000n, // Wholesale cost
  category: 'gaming'
});

if (decision.decision === 'Cleared') {
  console.log(`Cleared for settlement with ${decision.marginPercent} margin!`);
}
```

---

## 📂 Repository Architecture

```text
mercenta-primitives/
├── src/                # Solidity Contracts (PolicyEngine, MercentaCheckout, AgentTreasuryVault)
├── sdk/                # TypeScript Policy Gate SDK, x402, Onramp & Viem rails
│   ├── PolicyGate.ts   # 5-step policy validator
│   ├── abis.ts         # Contract ABIs
│   ├── constants.ts    # Arc Mainnet & Testnet addresses
│   ├── x402.ts         # Circle Agent Stack x402 protocol helper
│   ├── onramp.ts       # Arc Onramp Kit
│   └── client.ts       # High-level MercentaClient
├── skills/             # Agent Skills for autonomous commerce
│   └── mercenta-commerce/SKILL.md
├── test/               # Comprehensive test suites
├── examples/           # Autonomous agent procurement scripts
└── deployments/        # Arc Mainnet & Testnet contract artifacts
```

---

## ⚡ Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/rdmbtc/mercenta-primitives.git
cd mercenta-primitives

# Install dependencies and build SDK
npm install
npm run build

# Run Autonomous Procurement Agent simulation
npm run agent:procure

# Build Contracts with Foundry
forge build
```

---

<div align="center">
  <i>Built with ❤️ for the Arc Open Source Showcase</i>
</div>
