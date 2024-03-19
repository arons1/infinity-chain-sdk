import { XrplClient } from 'xrpl-client';

export type Payment = {
    TransactionType: string;
    Amount: string;
    Destination: string;
    Account: string;
    DestinationTag?: string;
    Sequence?: number;
    LastLedgerSequence?: number;
    Fee: string;
};

export type BuildTransactionParams = {
    amount: string;
    from: string;
    to: string;
    memo?: string;
    api: XrplClient;
    keyPair: any;
};
export type PreparePaymentParams = {
    api: XrplClient;
    tx: Payment;
};
