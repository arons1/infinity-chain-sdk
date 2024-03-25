import { TrezorWebsocket } from '../trezorWebsocket';

export type EstimateFeeParams = {
    extendedPublicKeys: string[];
    coinId: string;
    amount: string;
    connector: TrezorWebsocket;
    feeRatio?: number;
};
export type FeeResult = {
    low: string;
    high: string;
};
