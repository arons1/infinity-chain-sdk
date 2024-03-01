export type GeneralTransactionEncode = {
    blockheight?: string;
    blockHeight?: string;
    blocktime?: string;
    blockTime?: string;
    fees:string;
    txid:string;
    confirmations:string;
    tokenTransfers:TokenTransfer[];
    vin:vIn[];
    vout:vOut[];
    isError:number
};
type vIn = {
    addresses:string[];
    vout:number;
    n:number;
    txid:string;
    value:string;
    sequence?:string;
    hex?:string;
}
type vOut = {
    scriptPubKey:{
        addresses:string[];
        hex:string
    };
    n:number;
    value:string;
    spent:boolean;
}
type TokenTransfer = {
    to:string,
    from:string,
    contract:string,
    value:string,
    token:string,
    name:string,
    symbol:string,
    decimals:number
}