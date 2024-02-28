export type TokenTransactionEncode = {
    blockNumber: string;
    timeStamp?: string;
    time:string;
    hash: string;
    transactionHash?:string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    value: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: number;
    gasLimit: string;
    gasPrice: string;
    gasUsed: string;
    confirmations: string;
};
