import { BIP32Interface } from 'bitcoinjs-lib';
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
    keyPair: BIP32Interface;
};
export type PreparePaymentParams = {
    connector: XrplClient;
    tx: Payment;
};
