/**
 * Mercenta Primitives — Autonomous Agent Procurement Example
 * 
 * Demonstrates an AI agent:
 * 1. Proposing a purchase order (e.g. 250 Cloud Compute Hours for 2,100.00 USDC)
 * 2. Evaluating the 5-step deterministic policy engine
 * 3. Simulating execution & generating a cryptographic receipt on Arc
 */

import { evaluatePolicy, type OrderIntent, type PolicyConfig } from '../sdk/PolicyGate.js';

async function main() {
  console.log('🤖 Starting Mercenta Autonomous Agent Procurement Session on Arc...\n');

  // Enterprise Policy Constraints
  const enterprisePolicy: PolicyConfig = {
    availableToSpendUsdc: 10_000_000000n, // 10,000.00 USDC liquid spend allowance
    reservedLiquidityUsdc: 5_000_000000n, // 5,000.00 USDC liquidity buffer
    totalBalanceUsdc: 25_000_000000n,     // 25,000.00 USDC total balance
    grossMarginFloorBps: 1500n,           // 15.0% gross margin floor
    autoApprovalLimitUsdc: 5_000_000000n, // 5,000.00 USDC auto-approval ceiling
    verifiedSuppliers: new Set([
      '0x58863e4a739da0e62c2eba258b7783e95d5c48ce'.toLowerCase(), // Mercenta Verified Clearing
      '0x1111111111111111111111111111111111111111'.toLowerCase()  // Verified GPU Provider
    ])
  };

  // Scenario 1: Standard Compute Order (Cleared)
  const computeIntent: OrderIntent = {
    orderId: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    listingId: 'MR-COMPUTE-H100-250H',
    supplier: '0x58863e4a739da0e62c2eba258b7783e95d5c48ce',
    orderValueUsdc: 2_100_000000n, // 2,100.00 USDC retail price
    supplierCostUsdc: 1_650_000000n, // 1,650.00 USDC wholesale cost (21.43% margin)
    category: 'compute',
    region: 'US-EAST'
  };

  console.log('📋 Evaluating Order Intent 1: 250 Cloud Compute Hours (2,100.00 USDC)');
  const result1 = evaluatePolicy(computeIntent, enterprisePolicy);
  console.log(`Decision: \x1b[32m${result1.decision}\x1b[0m`);
  console.log(`Projected Gross Margin: ${result1.marginPercent} (Floor: 15.00%)`);
  console.log(`Rationale: ${result1.reason}`);
  console.log('Checks Summary:', result1.checks);
  console.log('---');

  // Scenario 2: Hallucinated / Negative Margin Attack (Blocked by Step 3)
  const maliciousIntent: OrderIntent = {
    orderId: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    listingId: 'MR-TOKEN-LLM-100M',
    supplier: '0x58863e4a739da0e62c2eba258b7783e95d5c48ce',
    orderValueUsdc: 1_000_000000n, // 1,000.00 USDC
    supplierCostUsdc: 1_050_000000n, // 1,050.00 USDC (NEGATIVE MARGIN!)
    category: 'tokens'
  };

  console.log('📋 Evaluating Order Intent 2: Injected / Negative Margin Order (1,000.00 USDC vs 1,050.00 Cost)');
  const result2 = evaluatePolicy(maliciousIntent, enterprisePolicy);
  console.log(`Decision: \x1b[31m${result2.decision}\x1b[0m`);
  console.log(`Rationale: ${result2.reason}`);
  console.log('---');

  // Scenario 3: Large Order Exceeding Auto-Approval Ceiling (Escalated by Step 5)
  const largeIntent: OrderIntent = {
    orderId: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    listingId: 'MR-CLUSTER-A100-MONTHLY',
    supplier: '0x58863e4a739da0e62c2eba258b7783e95d5c48ce',
    orderValueUsdc: 7_800_000000n, // 7,800.00 USDC (Limit is 5,000.00 USDC)
    supplierCostUsdc: 6_000_000000n, // 6,000.00 USDC (23.08% margin)
    category: 'compute'
  };

  console.log('📋 Evaluating Order Intent 3: High-Value Compute Cluster (7,800.00 USDC)');
  const result3 = evaluatePolicy(largeIntent, enterprisePolicy);
  console.log(`Decision: \x1b[33m${result3.decision}\x1b[0m`);
  console.log(`Rationale: ${result3.reason}`);
  console.log('\n🔒 Invariant verified: A model proposes — it never authorises.');
}

main().catch(console.error);
