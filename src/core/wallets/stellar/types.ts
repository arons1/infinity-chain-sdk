import { Keypair, Transaction } from 'stellar-sdk';
import { SwapHistoricalTransaction } from '../../types';

export type BuildTransactionParams = {
    value: string;
    destination: string;
    keyPair: Keypair;
    memo?: string;
    code?: string;
    issuer?: string;
};

export type SignTransactionParams = {
    secretKey: string;
    transaction: Transaction;
};
export type GetTransactionsParams = {
    walletAccount: number;
    walletName: string;
    lastTransactionHash?: string;
    swapHistorical?: SwapHistoricalTransaction[];
};
