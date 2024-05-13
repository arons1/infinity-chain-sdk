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
    walletName?: string;
};
export type GetTransactionParams = {
    walletName?: string;
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
    mnemonic: string;
    tokenContract?: string;
    approve?: boolean;
    walletName?: string;
};
export type SignTransactionParams = {
    transaction: TransactionEVM;
    mnemonic: string;
};
export type RPCBalancesParams = {
    contracts: string[];
    walletName?: string;
};
export type SignMessageParams = {
    mnemonic: string;
    message: string;
};
