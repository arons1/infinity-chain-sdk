import { BIP32Interface } from '@infinity/core/bip32';

export type BuildParameters = {
    extendedPublicKeys:string;
    coinId:string;
    amount:string;
    trezorWebsocket:any,
    privateAccountNode:BIP32Interface,
    destination:string,
    memo:string
}

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