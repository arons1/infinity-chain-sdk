import { TransactionEVM } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import Web3 from 'web3';
export type ReturnEstimate = {
    transaction: TransactionEVM;
    estimateGas: string;
    gasPrice?: string;
};
export type EstimateGasParams = {
    connector: Web3;
    source: string;
    tokenContract?: string;
    destination?: string;
    value?: string;
    chainId: number;
    gasPrice?: string;
    feeRatio?: number;
    priorityFee?: string;
    approve?: boolean;
};
export type EstimateGasTokenParams = {
    connector: Web3;
    source: string;
    tokenContract: string;
    destination: string;
    value?: string;
    gasPrice?: string;
    chainId: number;
    feeRatio?: number;
    priorityFee?: string;
    approve?: boolean;
};

export type NonceParams = {
    address: string;
    connector: Web3;
};

export type GasPriceParams = {
    connector: Web3;
};
export type GasLimitParams = {
    connector: Web3;
    source: string;
    destination: string;
    tokenContract?: string;
    value: string;
    chainId: number;
    contract?: any;
    isToken: boolean;
    approve?: boolean;
};

export type CalculateGasPrice = {
    transaction: TransactionEVM;
    gasPrice: string;
    connector: Web3;
    chainId: number;
    feeRatio?: number;
    priorityFee?: string;
};
