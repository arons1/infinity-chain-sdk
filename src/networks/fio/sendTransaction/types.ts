export type SendTransactionParams = {
    rawTransaction: string;
};

export type SendTransactionResult = {
    processed: {
        action_traces: ActionTrace[];
    };
    transaction_id: string;
};
type ActionTrace = {
    trx_id: string;
    act: ActData;
    error_code?: number;
    receipt: Receipt;
};
type ActData = {
    data: Data;
    name: string;
};
type Data = {
    actor: string;
    payee_public_key: string;
};
type Receipt = {
    response: string;
};
