/**
 * Mercenta Primitives — Network & Contract Constants
 * Arc Mainnet & Testnet configuration for Viem and Agent SDKs.
 */
import { defineChain } from 'viem';
export const ARC_MAINNET_CHAIN_ID = 5042;
export const ARC_TESTNET_CHAIN_ID = 5042002;
export const ARC_MAINNET_RPC = 'https://rpc.arc.io';
export const ARC_TESTNET_RPC = 'https://rpc.testnet.arc.io';
export const ARC_MAINNET_EXPLORER = 'https://explorer.arc.io';
export const ARC_TESTNET_EXPLORER = 'https://testnet.arcscan.app';
export const ARC_MAINNET_USDC = '0x3600000000000000000000000000000000000000';
export const ARC_TESTNET_USDC = '0x5042002000000000000000000000000000000000';
export const CONTRACT_ADDRESSES = {
    mainnet: {
        mercentaCheckout: '0x06b67adf8d63c8c35a6beda42a3bb93d485af3ed',
        usdc: ARC_MAINNET_USDC,
        chainId: ARC_MAINNET_CHAIN_ID,
        rpcUrl: ARC_MAINNET_RPC
    },
    testnet: {
        mercentaCheckout: '0x94cb86cda5b4bfe4e95155f9a64e6ec35b91a7dc',
        usdc: ARC_TESTNET_USDC,
        chainId: ARC_TESTNET_CHAIN_ID,
        rpcUrl: ARC_TESTNET_RPC
    }
};
export const arcMainnet = defineChain({
    id: ARC_MAINNET_CHAIN_ID,
    name: 'Arc Mainnet',
    nativeCurrency: {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6
    },
    rpcUrls: {
        default: {
            http: [ARC_MAINNET_RPC]
        }
    },
    blockExplorers: {
        default: {
            name: 'Arc Explorer',
            url: ARC_MAINNET_EXPLORER
        }
    }
});
export const arcTestnet = defineChain({
    id: ARC_TESTNET_CHAIN_ID,
    name: 'Arc Testnet',
    nativeCurrency: {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6
    },
    rpcUrls: {
        default: {
            http: [ARC_TESTNET_RPC]
        }
    },
    blockExplorers: {
        default: {
            name: 'ArcScan Testnet',
            url: ARC_TESTNET_EXPLORER
        }
    }
});
export const DEFAULT_POLICY_MARGIN_FLOOR_BPS = 1500n; // 15.0%
export const DEFAULT_AUTO_APPROVAL_LIMIT_USDC = 5000000000n; // 5,000.00 USDC
//# sourceMappingURL=constants.js.map