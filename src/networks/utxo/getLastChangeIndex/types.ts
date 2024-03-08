export type LastChangeIndexParameters = {
    extendedPublicKey:string,
    trezorWebsocket:any
}

export type ChangeIndexResult = {
    name:string;
    path:string;
    transfers:number;
    decimals:number;
}