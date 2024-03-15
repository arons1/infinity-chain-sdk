export type GeneralTransactionEncode = {
    blockRef: string;
    txID: string;
    origin: string;
    meta: Meta;
    clauses: Clauses[];
    receipt: Receipt;
    symbol?: string;
    transfers: {
        meta: Meta;
        recipient: Receipt;
    }[];
};

type Meta = {
    blockTimestamp: string;
    txIndex: string;
    blockID: string;
};
type Clauses = {
    to: string;
    value: string;
    origin: string;
};
type Receipt = {
    reverted: boolean;
    reward: string;
    gasPayer: string;
    paid: string;
};
export type TransactionInfo = {
    contract: string;
    reward: string;
    recipient: string;
    fee: string;
};
