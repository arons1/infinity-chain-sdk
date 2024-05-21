import { Transaction } from 'stellar-sdk';
import { SwapHistoricalTransaction } from '../../types';

export type EstimateFeeParams = {
    value: string;
    destination: string;
    idToken?: number;
    mintToken?: string;
    decimalsToken?: number;
    feeRatio?: number;
    walletName?: string;
};
export type BuildTransactionParams = {
    destination: string;
    value: string;
    mintToken?: string;
    keyPair: any;
    idToken?: number;
    decimalsToken?: number;
    feeRatio?: number;
};

export type GetTransactionsParams = {
    walletName?: string;
    lastTransactionHash?: string;
    swapHistorical?: SwapHistoricalTransaction[];
};

export type GetAccountBalancesParams = {
    assetSlugs: string[];
    walletName?: string;
};

export type SignTransactionParams = {
    keyPair: any;
    transaction: Transaction;
};
export type SignMessageParams = {
    secretKey: Buffer;
    message: Buffer;
};
