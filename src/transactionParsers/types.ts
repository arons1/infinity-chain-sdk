import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';

export type GeneralApiParams = {
    coinId?: Coins;
    address: string;
    page?: number;
    limit?: number;
    cursor?: string;
    chainId?: number;
    apiKey?: string;
    startblock?: number;
};
