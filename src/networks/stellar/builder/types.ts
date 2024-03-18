export type BuildTransactionParams = {
    value: string;
    source: string;
    destination: string;
    api: any;
    keyPair: any;
    memo?: string;
    code?: string;
    issuer?: string;
};
