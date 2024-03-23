import { XrplClient } from 'xrpl-client';

export type SendTransactionParams = {
    rawTransaction: string;
    connector: XrplClient;
};

export type TransactionResult = {
    engine_result: string;
    tx_json?: TxJson;
};
export type TxJson = {
    hash: string;
};
