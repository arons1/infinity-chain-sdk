import { Transaction, VersionedTransaction, Connection } from '@solana/web3.js';

export type EstimateFeeParams = {
    transaction: VersionedTransaction | Transaction;
    web3: Connection;
};
