import { TrezorWebsocket } from '../trezorWebsocket';

export type GetAccountInfoParams = {
    connector: TrezorWebsocket;
    address: string;
};

export type GetAccountBalancesParams = {
    connector: TrezorWebsocket;
    extendedPublicKeys: string[];
};
