import { VersionedTransaction, Connection, Transaction } from '@solana/web3.js';

export type EstimateFeeParams = {
    transaction: VersionedTransaction;
    web3: Connection;
    accounts: string[];
    signer: string;
};
export type EstimateLegacyFeeParams = {
    transaction: Transaction;
    web3: Connection;
    accounts: string[];
    signer: string;
};

export type GetBalanceAfterParams = {
    transaction: Transaction | VersionedTransaction;
    web3: Connection;
    signer: string;
};

export type DataBalance = {
    amount: string;
    mint?: string;
};
