export type AddAssociatedCreationParams = {
    instructions: any[];
    mintToken: string;
    destination: string;
    account: string;
    web3: any;
};

export type TransactionBuilderParams = {
    memo: string;
    keyPair: any;
    mintToken?: string;
    destination: string;
    account: string;
    decimalsToken?: number;
    amount: string;
    web3: any;
};

export type CurrencyTransactionParams = {
    memo: string;
    keyPair: any;
    destination: string;
    amount: string;
};
export type TokenTransactionParams = {
    memo: string;
    keyPair: any;
    mintToken: string;
    destination: string;
    account: string;
    decimalsToken: number;
    amount: string;
    web3: any;
};
