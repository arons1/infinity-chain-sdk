import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import { TrezorWebsocket } from '../trezorWebsocket';

export type EstimateFeeParams = {
    extendedPublicKeys: string[];
    coinId: Coins;
    amount: string;
    connector: TrezorWebsocket;
    feeRatio?: number;
};
export type FeeResult = {
    low: string;
    high: string;
};
