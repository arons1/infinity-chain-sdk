import { Transaction } from "stellar-sdk";

export type EstimateFeeParams = {
    value: string;
    destination: string;
    idToken?: number;
    mintToken?: string;
    decimalsToken?: number;
    feeRatio?: number;
    walletName?:string;
}
export  type BuildTransactionParams = {
    destination: string;
    value: string;
    mintToken?: string;
    mnemonic:string;
    idToken?: number;
    decimalsToken?: number;
    feeRatio?: number;
}

export type GetAccountBalancesParams = {
    assetSlugs: string[];
    walletName?:string
}

export type SignTransactionParams = {
    mnemonic:string;
    transaction: Transaction;
}
export type SignMessageParams = {
    mnemonic:string;
    message: Buffer;
}