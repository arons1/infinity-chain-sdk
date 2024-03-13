export type GeneralTransactionEncode = {
    block_num:number
    block_time:number;
    action_trace:ActionTrace;
};
type ActionTrace = {
    trx_id:string;
    act:ActData;
    error_code?:number;
    receipt:Receipt;
}
type ActData = {
    data:Data
    name:string;

}
type Data = {
    actor:string;
    payee_public_key:string;
}
type Receipt = {
    response:string;
}