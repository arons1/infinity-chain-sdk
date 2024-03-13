export type TokenTransactionEncode = {
    blockRef: string;
    txID: string;
    sender: string;
    recipient: string;
    amount: string;
    meta:Meta;
    symbol:string;
};

type Meta = {
    blockTimestamp:string;
    txIndex:string
}
