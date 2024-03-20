import { TransactionEVM } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import Web3 from 'web3';
export type ReturnEstimate = {
    transaction: TransactionEVM;
    estimateGas: string;
    gasPrice?: string;
};
export type EstimateGasParams = {
    web3: Web3;
    source: string;
    tokenContract?: string;
    destination?: string;
    amount?: string;
    chainId: number;
    feeRatio: number;
    priorityFee: string;
};
export type EstimateGasTokenParams = {
    web3: Web3;
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
    web3: Web3;
};

export type GasPriceParams = {
    web3: Web3;
};
export type GasLimitParams = {
    web3: Web3;
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
    web3: Web3;
    chainId: number;
    feeRatio: number;
    priorityFee?: string;
};
