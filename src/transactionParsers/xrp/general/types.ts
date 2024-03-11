export type GeneralTransactionEncode = {
    tx: Transaction;
    meta: Meta;
    validated: boolean;
};

export type Transaction = {
    hash: string;
    Destination: string;
    TransactionType: string;
    Amount: string;
    Account: string;
    Fee: string;
    date: number;
    ledger_index: string;
};
type Meta = {
    DeliveredAmount: string;
    TransactionResult: string;
};
