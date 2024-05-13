import { TransactionEVM } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { UTXOResult } from './utxo/getUTXO/types';

export type BuySellDetails ={
    idService: string;
    walletAddress: string;
    createdAt: string;
    status: string;
    fiatCurrency: string;
    userId: string;
    cryptoCurrency: string;
    isBuyOrSell: string;
    fiatAmount: number;
    cryptoAmount: number;
    network: string;
    txid: string;
    provider: string;
    coinId: string;
    fiatTransactionId: string;
}
export type Transaction = {
    blockNumber?: string;
    timeStamp?: string;
    hash?: string;
    from?: string;
    fromAlias?: string;
    to?: string;
    toAlias?: string;
    value?: string;
    isError?: boolean;
    fee?: string;
    confirmations?: string;
    tokenTransfers?: TokenTransfer[];
    internalTransactions?: InternalTransaction[];
    gasUsed?: string;
    extraId?: string;
    vIn?: vIn[];
    vOut?: vOut[];
    methodId?: string;
    type?: string;
    contractAddress?: string;
    swapDetails?:SwapDetails;
    dexDetails?:DexDetails;
    transactionType:TransactionType;
    buySellDetails?:BuySellDetails;
};
export enum TransactionType {
    RECEIVE = 'RECEIVE',
    SEND = 'SEND',
    DEX = 'DEX',
    SWAP = 'SWAP',
    TRADE = 'TRADE',
    WITHDRAW = 'WITHDRAW',
    DEPOSIT = 'DEPOSIT',
    STAKING = 'STAKING',
    ADD_LIQUIDY = 'ADD_LIQUIDY',
    REMOVE_LIQUIDY = 'REMOVE_LIQUIDY',
    BUYSELL = 'BUYSELL',
    APPROVE = 'APPROVE'
}
export enum StatusSwap {
    WAITING = 'Waiting',
    FAILED = 'Failed',
    COMPLETED = 'Completed',
    IN_PROCESS = 'In progress',
    KYC = "KYC",
}
export type SwapDetails = {
    idTransaction:string;
    fromCoin:string;
    toCoin:string;
    fromAmount:number;
    toAmount:number;
    exchange:string;
    status:StatusSwap;
    hashTo:string;
    hash:string;
    exchangeIcon?:string;
    exchangeName?:string;
    fromAddress:string;
    toAddress:string;
}
export type DexDetails = {
    exchangeIcon?:string;
    exchangeName?:string;
    fromAmount:string;
    toAmount:string;
    fromCoin:string;
    toCoin:string;
}
export type InternalTransaction = {
    from: string;
    fromAlias?: string;
    to: string;
    toAlias?: string;
    value?: string;
    extraId?: string;
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
    fromAlias?: string;
    to: string;
    toAlias?: string;
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
