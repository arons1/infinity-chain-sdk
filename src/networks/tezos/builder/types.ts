import { TezosToolkit,TransactionOperation } from '@taquito/taquito';

export type BuildTransactionParams = {
    source: string;
    destination: string;
    value: string;
    mintToken?: string;
    privateKey: string;
    connector: TezosToolkit;
    idToken?: number;
    decimalsToken?: number;
    feeRatio?: number;
};

export type BuildOperationsParams = {
    source: string;
    destination: string;
    value: string;
    mintToken: string;
    decimalsToken: number;
    idToken: number;
    connector: TezosToolkit;
};

export type BuildTransactionResult = {
    fee:string,
    broadcast:() => Promise<TransactionOperation>
}