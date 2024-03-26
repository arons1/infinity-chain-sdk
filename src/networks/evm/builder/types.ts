import Web3 from 'web3';

export type BuildTransaction = {
    source: string;
    destination: string;
    value?: string;
    connector: Web3;
    chainId: number;
    feeRatio?: number;
    priorityFee?: string;
    gasPrice?: string;
    privateKey: Buffer;
    tokenContract?: string;
    approve?: boolean;
};
export type BuildTokenTransaction = {
    source: string;
    destination: string;
    value: string;
    tokenContract: string;
    connector: Web3;
    chainId: number;
    feeRatio?: number;
    priorityFee?: string;
    gasPrice?: string;
    privateKey: Buffer;
};
export type DataTransferType = {
    source: string;
    destination: string;
    value: string;
    tokenContract: string;
    connector: Web3;
};
