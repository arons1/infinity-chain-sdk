import Web3 from "web3";

export type BuildTransaction = {
    source: string;
    destination: string;
    data?: string;
    value?: string;
    web3: Web3;
    chainId: number;
    feeRatio: number;
    priorityFee: string;
    gasPrice?: string;
};
export type BuildTokenTransaction = {
    source: string;
    destination: string;
    value: string;
    tokenContract: string;
    web3: Web3;
    chainId: number;
    feeRatio: number;
    priorityFee: string;
    gasPrice?: string;
};
export type DataTransferType = {
    source: string;
    destination: string;
    value: string;
    tokenContract: string;
    web3: Web3;
};
