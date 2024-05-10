import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

export type TrezorParams = {
    coinId: Coins;
    address: string;
    page?: number;
    lastBlockHeight?: string;
};
