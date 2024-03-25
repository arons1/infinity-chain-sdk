import { TezosToolkit, TransactionOperation } from '@taquito/taquito';
import { ContractMethod, ContractProvider } from '@taquito/taquito';

export type BuildTransactionParams = {
    source: string;
    destination: string;
    value: string;
    mintToken?: string;
    privateKey: string;
    connector: TezosToolkit;
    pkHash: string;
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
    fee: string;
    broadcast: () => Promise<TransactionOperation>;
};

export type BuildOperationResult = {
    operation: ContractMethod<ContractProvider>;
    fee: string;
};
export type BuildOperationParams = {
    pkHash: string;
    source: string;
    destination: string;
    value: string;
    mintToken: string;
    connector: TezosToolkit;
    idToken?: number;
    decimalsToken: number;
    feeRatio?: number;
};

export type BuildTransferParams = {
    connector: TezosToolkit;
    value: string;
    source: string;
    pkHash: string;
    destination: string;
    feeRatio: number;
};
