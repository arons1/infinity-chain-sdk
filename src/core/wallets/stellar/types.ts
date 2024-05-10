import { Transaction } from 'stellar-sdk';

export type BuildTransactionParams = {
    value: string;
    destination: string;
    mnemonic: string;
    memo?: string;
    code?: string;
    issuer?: string;
};

export type SignTransactionParams = {
    mnemonic: string;
    transaction: Transaction;
};
export type GetTransactionsParams = {
    walletName?:string,
    lastTransactionHash?:string
}