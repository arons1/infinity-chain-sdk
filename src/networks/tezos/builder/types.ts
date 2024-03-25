import {
    TezosToolkit,
    TransactionOperation,
    BatchOperation,
} from '@taquito/taquito';
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

export type BuildTransferOperationsParams = {
    source: string;
    destination: string;
    value: string;
    mintToken: string;
    decimalsToken: number;
    idToken: number;
    connector: TezosToolkit;
};
export type BuildOperationsParams = {
    operations: object[];
    connector: TezosToolkit;
    privateKey: string;
    pkHash: string;
    source: string;
};

export type BuildTransactionResult = {
    fee: string;
    broadcast: () => Promise<TransactionOperation>;
};
export type BuildOperationResult = {
    fee: string;
    broadcast: () => Promise<BatchOperation>;
};
export type BuildTransferOperationResult = {
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
