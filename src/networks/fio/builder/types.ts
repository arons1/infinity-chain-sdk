export type BuildTransactionParams = {
    value: string;
    source: string;
    destination: string;
    privateKey: string;
};
export type BuildTransactionFIOResult = {
    signatures: string[];
    compression: number;
    packed_context_free_data: string;
    packed_trx: string;
};
