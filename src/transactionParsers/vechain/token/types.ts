export type TokenTransactionEncode = {
    txID: string;
    meta: Meta;
    sender: string;
    recipient: string;
    amount: string;
    symbol: string;
    decimals: string;
};

type Meta = {
    blockID: string;
    blockNumber: number;
    blockTimestamp: number;
    txIndex: number;
    clauseIndex: number;
    logIndex: number;
};
