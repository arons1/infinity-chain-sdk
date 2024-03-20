import { TrezorWebsocket } from "../trezorWebsocket";

export type GetAccountInfoParams = {
    trezorWebsocket: TrezorWebsocket;
    address: string;
};

export type GetAccountBalancesParams = {
    trezorWebsocket: TrezorWebsocket;
    extendedPublicKeys: string[];
};
