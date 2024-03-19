import { TransactionEVM } from '@infinity/core-sdk';
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
    chainId: number;
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
