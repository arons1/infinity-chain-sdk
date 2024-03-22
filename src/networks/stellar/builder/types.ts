import { Server,Keypair } from 'stellar-sdk';

export type BuildTransactionParams = {
    value: string;
    source: string;
    destination: string;
    api: Server;
    keyPair: Keypair;
    memo?: string;
    code?: string;
    issuer?: string;
};
