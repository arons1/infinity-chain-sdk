import { Connection } from '@solana/web3.js';

export type GetAccountsTransactionsParams = {
    web3: Connection;
    address: string;
};

export type TokenBalancesResult = Record<string, number>;
