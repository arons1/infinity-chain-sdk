import { TrezorWebsocket } from '../trezorWebsocket';

export type GetUTXOParams = {
    extendedPublicKey: string;
    connector: TrezorWebsocket;
};
export type UTXOResult = {
    protocol: number;
    address: string;
    vout: string;
    value: string;
    path: string;
    txid: string;
    extendedPublicKey: string;
};
