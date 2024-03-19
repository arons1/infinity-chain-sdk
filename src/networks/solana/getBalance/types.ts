import {
    AccountInfo,
    Connection,
    ParsedAccountData,
    PublicKey,
} from '@solana/web3.js';

export type GetAccountsParams = {
    web3: Connection;
    address: string;
};

export type TokenBalancesResult = Record<string, number>;
export type GetAccountsResult = {
    account: AccountInfo<ParsedAccountData>;
    pubkey: PublicKey;
};
