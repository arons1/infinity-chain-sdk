import { Connection } from '@solana/web3.js';

export type GetAccountsTransactionsParams = {
    connector: Connection;
    accounts: string[];
};

export type TokenBalancesResult = Record<string, number>;
export type GetBalanceParams = {
    connector: Connection;
    address: string;
};
