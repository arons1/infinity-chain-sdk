import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';

export const PROVIDER_TREZOR: Record<Coins, string> = {
    [Coins.BTC]: 'https://btc1.trezor.io',
    [Coins.ETH]: 'https://eth1.trezor.io',
    [Coins.DOGE]: 'https://doge1.trezor.io',
    [Coins.GRS]: 'https://blockbook.groestlcoin.org',
    [Coins.LTC]: 'https://ltc1.trezor.io',
    [Coins.FIO]: '',
    [Coins.STELLAR]: '',
    [Coins.XRP]: '',
    [Coins.BNB]: '',
    [Coins.MATIC]: '',
    [Coins.ONE]: '',
    [Coins.CRS]: '',
    [Coins.VET]: '',
    [Coins.SOLANA]: '',
    [Coins.TEZOS]: '',
    [Coins.AVAX]: '',
    [Coins.XDC]: '',
    [Coins.KCC]: '',
    [Coins.OKX]: '',
    [Coins.BSC]: '',
    [Coins.ARB]: '',
    [Coins.ETH_TESTNET]: '',
    [Coins.BSC_TESTNET]: '',
};
export const SLEEP_BETWEEN_CALLS = 500;
