import { Chains } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import Web3 from 'web3';

export type BuildTransaction = {
    source: string;
    destination: string;
    value?: string;
    connector: Web3;
    chainId: Chains;
    feeRatio?: number;
    priorityFee?: string;
    gasPrice?: string;
    privateKey: string;
    tokenContract?: string;
    approve?: boolean;
};
export type BuildTokenTransaction = {
    source: string;
    destination: string;
    value: string;
    tokenContract: string;
    connector: Web3;
    chainId: Chains;
    feeRatio?: number;
    priorityFee?: string;
    gasPrice?: string;
    privateKey: string;
};
export type DataTransferType = {
    source: string;
    destination: string;
    value: string;
    tokenContract: string;
    connector: Web3;
};
