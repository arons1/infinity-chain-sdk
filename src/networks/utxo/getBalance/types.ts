export type GetAccountInfoParams = {
    trezorWebsocket: any;
    address: string;
};

export type GetAccountBalancesParams = {
    trezorWebsocket: any;
    extendedPublicKeys: string[];
};
