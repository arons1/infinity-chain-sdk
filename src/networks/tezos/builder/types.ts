import { TezosToolkit } from '@taquito/taquito';

export type BuildTransactionParams = {
    source: string;
    destination: string;
    value: string;
    mintToken?: string;
    privateKey: string;
    connector: TezosToolkit;
    idToken?: number;
    feeRatio?: number;
};

export type BuildOperationsParams = {
    source: string;
    destination: string;
    value: string;
    mintToken: string;
    idToken: number;
    connector: TezosToolkit;
};
