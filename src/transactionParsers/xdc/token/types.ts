export type TokenTransactionEncode = {
    blockNumber: string;
    timestamp: string;
    time: string;
    hash: string;
    transactionHash?: string;
    blockHash: string;
    from: string;
    address: string;
    to: string;
    value: string;
    tokenName: string;
    symbol: string;
    tokenDecimal: number;
    gasLimit: string;
    gasPrice: string;
    gasUsed: string;
    confirmations: string;
};
