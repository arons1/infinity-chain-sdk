import { TezosToolkit } from '@taquito/taquito';

export type BuildTransactionParams = {
    source: string;
    destination: string;
    value: string;
    mintToken?: string;
    privateKey: string;
    web3: TezosToolkit;
    idToken?: number;
    feeRatio?: number;
};

export type BuildOperationsParams = {
    source: string;
    destination: string;
    value: string;
    mintToken: string;
    idToken: number;
    web3: TezosToolkit;
};
