export type GeneralTransactionEncode = {
    transaction:Transaction
    operations:Operation[]
};
export type EffectsEncode = {
    id: string;
    amount:string;
    asset_code?:string;
    asset_type?:string;
    asset_issuer?:string
}
type Transaction = {
    source_account:string;
    id:string;
    ledger_attr:string;
    fee_charged:string;
    created_at:string;
}
type Operation = {
    source_amount?:string;
    source_asset_issuer?:string;
    price?: string;
    claimants:any[];
    source_account:string;
    source_asset_type?:string
    source_asset_code?:string;
    selling_asset_type?:string;
    selling_asset_code?:string;
    selling_asset_issuer?:string;
    buying_asset_type?:string;
    buying_asset_code?:string;
    buying_asset_issuer?:string;
    starting_balance?:string;
    account:string;
    type:string;
    into:string;
    id:string;
    asset:string;
    asset_type:string;
    asset_issuer:string;
    asset_code:string;
    amount:string;
    from:string;
    to:string;
}
