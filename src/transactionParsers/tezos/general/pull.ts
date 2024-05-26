import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import { GeneralApiParams } from '../../types';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';

export const pull = ({ address, limit, cursor }: GeneralApiParams) => {
    const coinConfig = config[Coins.TEZOS];

    return {
        method: 'GET',
        url: `${coinConfig.apiUrl}/v1/tokens/transfers?anyof.from.to=${address}&sort.desc=id&limit=${limit}${cursor != undefined ? '&lastId=' + cursor : ''}`,
    };
};
