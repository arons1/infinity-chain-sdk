import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import { GeneralApiParams } from '../../types';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';

export const pull = ({ address, page, limit }: GeneralApiParams) => {
    const coinConfig = config[Coins.FIO];
    return {
        url:
            coinConfig.apiUrlSecundary +
            '/api/kcs/address/calltrans/' +
            address +
            '/' +
            page +
            '/' +
            limit,
        method: 'GET',
    };
};
