import { SwapHistoricalTransaction } from '../../types';

export type BuildTransactionParams = {
    value: string;
    destination: string;
    privateKey: string;
    walletAccount: number;
    walletName: string;
};
export type GetTransactionsParams = {
    walletAccount: number;
    endBlock?: string;
    walletName: string;
    swapHistorical?: SwapHistoricalTransaction[];
};
