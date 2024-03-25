import { TezosToolkit } from '@taquito/taquito';

export type EstimateFeeParams = {
    value: string;
    source: string;
    destination: string;
    idToken?: number;
    mintToken?: string;
    decimalsToken?: number;
    connector: TezosToolkit;
    feeRatio?: number;
    pkHash: string;
};
export type EstimateOperation = {
    operations: object[];
    connector: TezosToolkit;
    pkHash: string;
    source: string;
};
