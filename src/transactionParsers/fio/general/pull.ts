import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import { GeneralApiParams } from '../../types';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
export const pull = ({ address, page, limit }: GeneralApiParams) => {
    const coinConfig = config[Coins.FIO];
    return {
        url: coinConfig.apiKey + '/v1/history/get_actions',
        method: 'POST',
        body: {
            account_name: address,
            pos: (page as number) - (limit as number),
            offset: page,
        },
    };
};

export const initPosition = ({ address }: GeneralApiParams) => {
    const coinConfig = config[Coins.FIO];
    return {
        url: coinConfig.apiKey + '/v1/history/get_actions',
        method: 'POST',
        body: {
            account_name: address,
            pos: -1,
        },
    };
};
