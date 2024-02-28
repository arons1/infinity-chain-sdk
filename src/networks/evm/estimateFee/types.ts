import { TransactionEVM } from '../general/types';
export type ReturnEstimate = {
    transaction: TransactionEVM;
    estimateGas: string;
    gasPrice?: string;
};
export type EstimateGasParams = {
    web3: any;
    source: string;
    tokenContract?: string;
    destination?: string;
    amount?: string;
    chainId: number;
    feeRatio: number;
    priorityFee: string;
};
export type EstimateGasTokenParams = {
    web3: any;
    source: string;
    tokenContract: string;
    destination: string;
    amount?: string;
    chainId: number;
    feeRatio: number;
    priorityFee: string;
};
export type EstimateGasBridgeParams = {
    web3: any;
    source: string;
    destination?: string;
    amount?: string;
    feeRatio: number;
    chainId: number;
};

export type NonceParams = {
    address: string;
    web3: any;
};

export type GasPriceParams = {
    web3: any;
};
export type GasLimitParams = {
    web3: any;
    source: string;
    destination: string;
    tokenContract?: string;
    amount: string;
    contract?: any;
    isToken: boolean;
};

export type CalculateGasPrice = {
    transaction: TransactionEVM;
    gasPrice: string;
    web3: any;
    chainId: number;
    feeRatio: number;
    priorityFee?: string;
};
