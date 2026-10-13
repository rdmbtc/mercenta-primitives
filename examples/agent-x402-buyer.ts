/**
 * Mercenta Primitives — Circle Agent Stack x402 Autonomous Buyer Example
 * 
 * Demonstrates an autonomous agent:
 * 1. Taking a user prompt: "Buy 100 Telegram Stars for channel @creative_studio"
 * 2. Evaluating the 5-step deterministic policy engine (Spend cap, margin, verified supplier)
 * 3. Requesting an HTTP 402 challenge from Mercenta API (Circle Agent Stack)
 * 4. Resolving payment on Arc Mainnet (Chain ID 5042)
 * 5. Fulfilling the order and obtaining instant digital voucher credentials
 */

import { evaluatePolicy, type OrderIntent, type PolicyConfig } from '../sdk/PolicyGate.js';
import { MercentaClient } from '../sdk/client.js';
import { parseX402Response, buildX402Headers } from '../sdk/x402.js';

async function runAutonomousBuyer() {
  console.log('🤖 [Agent] Initializing Circle Agent Stack x402 Procurement Runner...');

  const client = new MercentaClient({ network: 'mainnet' });

  // 1. Business & Treasury Policy Configuration (5 Gates)
  const businessPolicy: PolicyConfig = {
    availableToSpendUsdc: 500_000000n,    // $500.00 USDC spend allowance
    reservedLiquidityUsdc: 100_000000n,   // $100.00 USDC operational buffer
    totalBalanceUsdc: 1_200_000000n,      // $1,200.00 USDC treasury balance
    grossMarginFloorBps: 1500n,           // >= 15.0% gross margin floor
    autoApprovalLimitUsdc: 50_000000n,    // Orders <= $50.00 USDC auto-approved
    verifiedSuppliers: new Set([
      client.contractAddresses.mercentaCheckout.toLowerCase()
    ])
  };

  // 2. User intent parsed by agent
  const userPrompt = "Buy 100 Telegram Stars for @creative_studio";
  console.log(`💬 User Request: "${userPrompt}"`);

  const orderIntent: OrderIntent = {
    orderId: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    listingId: 'telegram-stars-100',
    supplier: client.contractAddresses.mercentaCheckout,
    orderValueUsdc: 1_990000n,  // 1.99 USDC retail
    supplierCostUsdc: 1_650000n, // 1.65 USDC cost (17.08% margin)
    category: 'subscriptions',
    region: 'GLOBAL'
  };

  // 3. Evaluate 5-Step Policy Engine
  console.log('🛡️ Step 1: Evaluating 5-Step Deterministic Policy Gate...');
  const policyResult = client.evaluate(orderIntent, businessPolicy);

  if (policyResult.decision !== 'Cleared') {
    console.error(`❌ Order rejected by policy: ${policyResult.reason}`);
    return;
  }
  console.log(`✅ Policy Cleared! Projected gross margin: ${policyResult.marginPercent}`);

  // 4. Request x402 Challenge from Mercenta Gateway
  const endpoint = 'https://mainnet.mercenta.xyz/api/x402/order';
  console.log(`🌐 Step 2: Requesting HTTP 402 challenge from ${endpoint}...`);

  try {
    const challenge = await client.requestX402Challenge(endpoint, {
      productId: 'telegram-stars-100',
      recipient: '@creative_studio',
      units: 1
    });

    console.log('⚡ Step 3: Received HTTP 402 Payment Required:');
    console.log(`   - Order ID: ${challenge.challenge.orderId}`);
    console.log(`   - Amount: ${challenge.challenge.amountUsdc} USDC (${challenge.challenge.amountUnits} micro-units)`);
    console.log(`   - Chain: Arc Mainnet (${challenge.challenge.chainId})`);
    console.log(`   - Payee: ${challenge.challenge.recipient}`);

    // 5. Payment settlement simulation (in live production: signed via agent MPC / private key)
    console.log('💸 Step 4: Signing Arc Mainnet settlement payment...');
    const simulatedTxHash = '0xcf322d7d8049bbf7f11d6cde15d8c56bde4a81dade45a1201b41e4751662253e'; // Verified Arc Mainnet pilot hash

    // 6. Fulfill order with payment proof
    console.log('📦 Step 5: Submitting payment proof (X-Payment-Tx) to release voucher...');
    const fulfillment = await client.fulfillX402Order(endpoint, {
      txHash: simulatedTxHash,
      orderId: challenge.challenge.orderId,
      agentId: 'agent-studio-procurement-v1'
    });

    console.log('🎉 Order Successfully Fulfilled on Arc!');
    console.log(`   - Status: ${fulfillment.status}`);
    console.log(`   - Receipt ID: ${fulfillment.receiptId}`);
    console.log(`   - Item Code / Voucher: \x1b[32m${fulfillment.itemCode}\x1b[0m`);
    console.log(`   - Delivery: ${fulfillment.delivery.payload}`);
    console.log(`   - Confirmed At: ${fulfillment.confirmedAt}`);
  } catch (err: any) {
    console.error('Execution note:', err.message);
  }
}

runAutonomousBuyer().catch(console.error);
