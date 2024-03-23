import { VersionedTransaction, Connection, Transaction } from '@solana/web3.js';

export type EstimateFeeParams = {
    transaction: VersionedTransaction;
    connector: Connection;
    accounts: string[];
    signer: string;
};
export type EstimateLegacyFeeParams = {
    transaction: Transaction;
    connector: Connection;
    accounts: string[];
    signer: string;
};

export type GetBalanceAfterParams = {
    transaction: Transaction | VersionedTransaction;
    connector: Connection;
    signer: string;
};

export type DataBalance = {
    amount: string;
    mint?: string;
};
