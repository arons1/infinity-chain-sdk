import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import { GeneralApiParams } from '../../types';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';

export const pull = ({ address, page, limit }: GeneralApiParams) => {
    const coinConfig = config[Coins.VET];

    return {
        method: 'GET',
        url: `${coinConfig.apiUrl}/api/accounts/${address.toLowerCase()}/transfers?limit=${limit}${'&offset=' + (page ?? 0)}`,
    };
};
