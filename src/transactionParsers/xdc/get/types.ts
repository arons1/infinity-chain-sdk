import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

export type EtherscanParams = {
    coinId: Coins;
    address: string;
    lastTransactionHash?: string;
    page?: number;
};
