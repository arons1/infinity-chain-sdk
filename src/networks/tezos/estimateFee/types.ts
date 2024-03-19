import { TezosToolkit } from '@taquito/taquito';

export type EstimateFeeParams = {
    address: string;
    amount: string;
    from: string;
    to: string;
    idToken?: number;
    mintToken?: string;
    web3: TezosToolkit;
    feeRatio: number;
};
