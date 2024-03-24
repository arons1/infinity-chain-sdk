import { TezosToolkit } from '@taquito/taquito';

export type EstimateFeeParams = {
    amount: string;
    from: string;
    to: string;
    idToken?: number;
    mintToken?: string;
    decimalsToken?: number;
    connector: TezosToolkit;
    privateKey: string;
    feeRatio?: number;
};
