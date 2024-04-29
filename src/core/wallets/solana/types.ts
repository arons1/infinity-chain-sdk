import { Transaction, VersionedTransaction } from '@solana/web3.js';

export type TransactionBuilderParams = {
    memo: string;
    mintToken?: string;
    destination: string;
    decimalsToken?: number;
    value: string;
    mnemonic: string;
};

export type SignTransactionParams = {
    transaction: VersionedTransaction | Transaction;
    mnemonic: string;
};

export type SignMessageParams = {
    mnemonic: string;
    message: Buffer;
};
export type GetBalanceAfterParams = {
    transaction: Transaction | VersionedTransaction;
    walletName?: string;
};
export type EstimateFeeParams = {
    memo: string;
    walletName?: string;
    mintToken?: string;
    destination: string;
    decimalsToken?: number;
    value: string;
};
