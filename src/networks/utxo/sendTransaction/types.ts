import { TrezorWebsocket } from '../trezorWebsocket';

export type SendTransactionParams = {
    trezorWebsocket: TrezorWebsocket;
    rawTransaction: string;
};
