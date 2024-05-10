import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { GeneralApiParams } from '../../types';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

export const pull = ({ address, limit, cursor }: GeneralApiParams) => {
    const coinConfig = config[Coins.STELLAR];

    return {
        method: 'GET',
        url: `${coinConfig.apiUrl}/v1/accounts/${address}/operations?limit=${limit}${cursor != undefined ? '&lastId=' + cursor : ''}`,
    };
};
