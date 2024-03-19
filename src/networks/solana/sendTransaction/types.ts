import { Connection } from '@solana/web3.js';

export type SendTransactionParams = {
    web3: Connection;
    rawTransaction: Buffer;
};
