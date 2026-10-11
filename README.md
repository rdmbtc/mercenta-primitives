<div align="center">
  <h1>🛡️ Mercenta Primitives</h1>
  <p><strong>A reusable agent-economy toolkit built for the Arc blockchain.</strong></p>

  <img src="https://img.shields.io/badge/Arc-000000?style=for-the-badge&logo=circle&logoColor=white" alt="Arc" />
  <img src="https://img.shields.io/badge/Foundry-FCC624?style=for-the-badge&logo=rust&logoColor=white" alt="Foundry" />
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
  <img src="https://img.shields.io/badge/Viem-FFB84C?style=for-the-badge&logo=javascript&logoColor=black" alt="Viem" />
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
- **Payments:** `@circle-fin/x402-batching` with Circle Gateway batched nanopayments.
- **Cross-Chain Ingestion:** CCTP V2 Iris attestation for cross-chain liquidity.
- **MPC Wallets:** User & developer-controlled 2-of-2 MPC agent wallets.

---

## 🔵 Circle Agent Stack usage

| Layer | Circle Tool | Usage |
| --- | --- | --- |
| **Agent Micropayments** | `@circle-fin/x402-batching` | Nanopayment verification and settlement via Circle Gateway |
| **Cross-chain Liquidity** | CCTP V2 + Iris | Seamless bridging from Ethereum Sepolia into Arc USDC |
| **Production Reference** | Mercenta Live Console | Settles real agent checkouts on Arc Mainnet ([mainnet.mercenta.xyz/app](https://mainnet.mercenta.xyz/app)) |

---

## ⚖️ Compared to existing Arc examples, what do we add?

Baseline repositories (like basic `arc-commerce` or `arc-p2p-payments`) focus on simple, unconstrained transfers. 

**Mercenta Primitives ships complete institutional infrastructure for the AI economy:**
- **Deterministic 5-Step Policy Engine:** Prevents prompt injections and negative margins before signing.
- **Single Append-Only Ledger Receipts:** Eliminates the finance reconciliation nightmare.
- **Human-in-the-Loop Escalation:** Automatically routes high-value orders into pause queues.
- **Hardware-Grade Circuit Breakers:** Instant operational halts without upgradeable proxies.
- **Battle-Tested On Arc Mainnet:** Live reference code running in production.

---

## 📂 Repository Architecture

```text
mercenta-primitives/
├── src/                # Solidity Contracts (PolicyEngine, MercentaCheckout, AgentTreasuryVault)
├── sdk/                # TypeScript Policy Gate SDK & Viem rails
├── test/               # Comprehensive Foundry test suites
├── examples/           # Autonomous agent procurement scripts
└── deployments/        # Arc Mainnet & Testnet contract artifacts
```

---

## 🛠️ Quick Start

### Build Contracts

```bash
# Clone the repository
git clone https://github.com/rdmbtc/mercenta-primitives.git
cd mercenta-primitives

# Build with Foundry
forge build
```

### Run Autonomous Agent Example

```bash
npm install
npm run agent:procure
```

---

<div align="center">
  <i>Built with ❤️ for the Arc Open Source Showcase</i>
</div>
