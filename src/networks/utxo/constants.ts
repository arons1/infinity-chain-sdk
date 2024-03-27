import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';

export const DUST: Record<string, number> = {
    [Coins.BTC]: 546,
    [Coins.LTC]: 1000,
    [Coins.DOGE]: 50000000,
    [Coins.GRS]: 1000,
};
export const WEBSOCKETS: Record<string, string> = {
    [Coins.BTC]: 'https://btc1.trezor.io',
    [Coins.LTC]: 'https://ltc1.trezor.io',
    [Coins.DOGE]: 'https://doge1.trezor.io',
    [Coins.GRS]: 'https://blockbook.groestlcoin.org',
};
