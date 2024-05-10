import { Coins } from "@infinity/core-sdk/lib/commonjs/networks";

export type EtherscanParams = {
    coinId: Coins;
    address: string;
    startblock: string;
    page?: number;
};
