import { PublicKey,Connection } from '@solana/web3.js';

export type AddAssociatedCreationParams = {
    instructions: any[];
    mintToken: string;
    destination: string;
    publicKey: PublicKey;
    web3: Connection;
};

export type TransactionBuilderParams = {
    memo: string;
    keyPair: any;
    mintToken?: string;
    destination: string;
    decimalsToken?: number;
    amount: string;
    web3: Connection;
};
export type RawTransactionParams = {
    memo: string;
    publicKey: PublicKey;
    mintToken?: string;
    destination: string;
    decimalsToken?: number;
    amount: string;
    web3: Connection;
};

export type CurrencyTransactionParams = {
    memo: string;
    publicKey: PublicKey;
    destination: string;
    amount: string;
};
export type TokenTransactionParams = {
    memo: string;
    mintToken: string;
    destination: string;
    publicKey: PublicKey;
    decimalsToken: number;
    amount: string;
    web3: Connection;
};
