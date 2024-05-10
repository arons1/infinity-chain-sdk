import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { GeneralApiParams } from '../../types';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

export const pull = ({ address, limit, cursor }: GeneralApiParams) => {
    const coinConfig = config[Coins.STELLAR];

    return {
        method: 'GET',
        url: `${coinConfig.apiUrl}/accounts/${address}/operations?join=transactions&limit=${limit}&order=desc${cursor != undefined ? '&cursor=' + cursor : ''}`,
    };
};

export const pullEffects = ({ address, limit, cursor }: GeneralApiParams) => {
    const coinConfig = config[Coins.STELLAR];
    return {
        method: 'GET',
        url: `${coinConfig.apiUrl}/accounts/${address}/effects?limit=${limit}&order=desc${cursor != undefined ? '&cursor=' + cursor : ''}`,
    };
};
