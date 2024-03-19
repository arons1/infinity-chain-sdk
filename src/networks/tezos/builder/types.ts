export type BuildTransactionParams = {
    source: string;
    destination: string;
    value: string;
    mintToken?: string;
    privateKey: string;
    web3: any;
    idToken?: number;
    feeRatio?: number;
};

export type BuildOperationsParams = {
    source: string;
    destination: string;
    value: string;
    mintToken: string;
    idToken: number;
    web3: any;
};
