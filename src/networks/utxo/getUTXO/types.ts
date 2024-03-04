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