import { TransactionEVM } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { SwapHistoricalTransaction } from '../../types';

export type EstimateGasParams = {
    tokenContract?: string;
    destination?: string;
    value?: string;
    gasPrice?: string;
    feeRatio?: number;
    priorityFee?: string;
    approve?: boolean;
    walletAccount: number;
    walletName: string;
};
export type GetTransactionParams = {
    walletAccount: number;
    walletName: string;
    lastTransactionHash?: string;
    startblock?: string;
    swapHistorical?: SwapHistoricalTransaction[];
};
export type BuildTransaction = {
    destination: string;
    value?: string;
    feeRatio?: number;
    priorityFee?: string;
    gasPrice?: string;
    privateKey: string;
    tokenContract?: string;
    approve?: boolean;
    walletName: string;
    walletAccount: number;
};
export type SignTransactionParams = {
    transaction: TransactionEVM;
    privateKey: string;
};
export type RPCBalancesParams = {
    contracts: string[];
    walletAccount: number;
    walletName: string;
};
export type SignMessageParams = {
    privateKey: string;
    message: string;
};
