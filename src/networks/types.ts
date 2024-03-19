import { TransactionEVM } from '@infinity/core-sdk';
import { UTXOResult } from './utxo/getUTXO/types';
export type Transaction = {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    from: string;
    to: string;
    value?: string;
    isError: boolean;
    fee?: string;
    confirmations: string;
    tokenTransfers?: TokenTransfer[];
    gasUsed?: string;
    extraId?: string;
    vIn?: vIn[];
    vOut?: vOut[];
    type: string;
    contractAddress?: string;
};
export type EstimateFeeResult = {
    fee?: string;
    transaction?: TransactionEVM;
    feePerByte?: {
        low: string;
        high: string;
    };
    utxos?: UTXOResult[];
    utxosUsed?: UTXOResult[];
    transactionSize?: string;
};
export type BalanceResult = {
    address?: string;
    value: string;
    code?: string;
    id?: number;
    freeze?: string;
};
export type CurrencyBalanceResult = {
    balance: string;
    available?: string;
};
export type TokenTransfer = {
    contractAddress?: string;
    tokenName?: string;
    tokenSymbol?: string;
    tokenDecimal?: number;
    value: string;
    from: string;
    to: string;
    id?: string;
    type?: string;
};
export type vIn = {
    txid: string;
    n: number;
    vout: number;
    value: string;
    address: string;
    sequence?: string;
    hex?: string;
};
export type vOut = {
    n: number;
    value: string;
    address: string;
    spent: boolean;
    hex?: string;
};
