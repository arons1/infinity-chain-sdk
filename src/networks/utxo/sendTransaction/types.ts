import { TrezorWebsocket } from '../trezorWebsocket';

export type SendTransactionParams = {
    connector: TrezorWebsocket;
    rawTransaction: string;
};
