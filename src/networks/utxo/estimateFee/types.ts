export type EstimateFeeParams = {
    extendedPublicKeys:string[],
    coinId:string,
    amount:string,
    trezorWebsocket:any
}
export type GetUTXOParams = {
    extendedPublicKey:string,
    trezorWebsocket:any
}
export type UTXOResult = {
    address:string,
    vout:string,
    value:string,
    path:string,
    segwit:boolean
}

export type EstimateFeeResult = {
    feePerByte:{
        low:string;
        high:string
    },
    utxos:UTXOResult[];
    utxosUsed:UTXOResult[];
    transactionSize:string
}