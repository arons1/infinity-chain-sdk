import { CoinIds } from '@infinity/core-sdk/lib/commonjs/networks';
import { Chains } from '@infinity/core-sdk/lib/commonjs/networks/evm';

export const PROVIDERS: Record<Chains, string> = {
    [Chains.BSC_TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    [Chains.BSC]: 'https://bsc-dataseed.bnbchain.org/',
    [Chains.MATIC]: 'https://polygon-rpc.com',
    [Chains.ETH_TESTNET]:
        'wss://ropsten.infura.io/ws/v3/7a88decb96744f998ab69192dc97fb40',
    [Chains.ETH]: 'https://rpc.ankr.com/eth',
    [Chains.ONE]: 'https://api.harmony.one',
    [Chains.XDC]: 'https://erpc.xinfin.network',
    [Chains.KCC]: 'https://rpc-mainnet.kcc.network',
    [Chains.OKX]: 'https://exchainrpc.okex.org',
    [Chains.AVAX]: 'https://api.avax.network/ext/bc/C/rpc',
    [Chains.CRS]: 'https://evm.cronos.org',
    [Chains.OP]:
        'https://optimism-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8',
    [Chains.ARB]: 'https://arb1.arbitrum.io/rpc',
    [Chains.VET]: 'https://mainnet.vechain.org/',
    [Chains.BASE]: 'https://base-rpc.publicnode.com',
};

export const API_RPCS: Record<CoinIds, string> = {
    [CoinIds.BTC]: 'https://btc1.trezor.io',
    [CoinIds.LTC]: 'https://ltc1.trezor.io',
    [CoinIds.DOGE]: 'https://doge1.trezor.io',
    [CoinIds.GRS]: 'https://blockbook.groestlcoin.org',
    [CoinIds.FIO]: '',
    [CoinIds.STELLAR]: '',
    [CoinIds.XRP]: '',
    [CoinIds.ETH]: '',
    [CoinIds.BNB]: '',
    [CoinIds.SOLANA]: 'https://mainnet-beta.solflare.network/',
    [CoinIds.TEZOS]: 'https://prod.tcinfra.net/rpc/mainnet',
};
