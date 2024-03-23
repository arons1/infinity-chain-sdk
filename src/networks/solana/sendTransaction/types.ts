import { Connection } from '@solana/web3.js';

export type SendTransactionParams = {
    connector: Connection;
    rawTransaction: Buffer;
};
