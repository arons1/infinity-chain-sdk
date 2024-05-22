import { BIP32Interface } from 'bitcoinjs-lib';
import { SwapHistoricalTransaction } from '../../types';

export type BuildTransactionParams = {
    amount: string;
    from: string;
    to: string;
    memo?: string | undefined;
    keyPair: BIP32Interface;
};
export type GetTransactionsParams = {
    walletAccount: number;
    walletName: string;
    lastTransactionHash?: string;
    swapHistorical?: SwapHistoricalTransaction[];
};
