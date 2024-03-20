import { TrezorWebsocket } from '../trezorWebsocket';

export type LastChangeIndexParameters = {
    extendedPublicKey: string;
    trezorWebsocket: TrezorWebsocket;
};

export type ChangeIndexResult = {
    name: string;
    path: string;
    transfers: number;
    decimals: number;
};
