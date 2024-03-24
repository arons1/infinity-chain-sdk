import { Connection, ParsedTransactionWithMeta } from '@solana/web3.js';
import { GetAccountsResult } from '../utils/types';

export type GetAccountsTransactionsParams = {
    connector: Connection;
    address: string;
    accounts: GetAccountsResult[];
    signatures?: Record<string, string>;
    limit?: number;
};
export type GetAccountsHashesParams = GetAccountsTransactionsParams;
export type GetAccountsTransactionsHashesParams = GetAccountsTransactionsParams;
export type GetBatchAddressesWithPaginationParams = {
    connector: any;
    accounts: AddressesFormat[];
    signatures: Record<string, string>;
    pagination: Record<string, string>;
    limit: number;
};
export type AddressesFormat = {
    mint: string;
    address: string;
};
export type HashesResult = {
    address: string;
    result: string[];
    mint: string;
};
export type PaginationData = {
    limit: number;
    before?: string;
    until?: string;
};

export type ResultBatch = {
    result: ResultSignature[];
    jsonrpc: '2.0';
    id: string;
};
export type ResultSignature = {
    signature: string;
    slot: number;
    err: string | {} | null;
    memo: string | null;
    blockTime?: number | null | undefined;
};
export type HashesDetails = {
    mint: string;
    details?: ParsedTransactionWithMeta;
};
export type GetTransactionsParams = {
    pendingTransactions: string[];
    connector: Connection;
};
