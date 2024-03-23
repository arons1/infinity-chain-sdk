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
    connector: XrplClient;
    keyPair: any;
};
export type PreparePaymentParams = {
    connector: XrplClient;
    tx: Payment;
};
