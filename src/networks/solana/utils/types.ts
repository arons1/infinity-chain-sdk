import {
    AccountInfo,
    Connection,
    ParsedAccountData,
    PublicKey,
} from '@solana/web3.js';

export type ResultBlockHash = {
    blockhash: string;
    lastValidBlockHeight: number;
};
export type GetAccountsParams = {
    connector: Connection;
    address: string;
};
export type GetAccountsResult = {
    account: AccountInfo<ParsedAccountData>;
    pubkey: PublicKey;
};
