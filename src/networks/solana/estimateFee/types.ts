import { Connection, PublicKey } from '@solana/web3.js';

export type EstimateFeeParams = {
    memo: string;
    publicKey: PublicKey;
    mintToken?: string;
    destination: string;
    decimalsToken?: number;
    value: string;
    connector: Connection;
};
