import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import { GeneralApiParams } from '../../types';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';

export const pull = ({ address, limit, cursor }: GeneralApiParams) => {
    const coinConfig = config[Coins.XRP];
    return {
        url: coinConfig.apiUrl,
        method: 'POST',
        body: {
            market: cursor,
            command: 'account_tx',
            account: address,
            limit: limit,
            forward: false,
        },
    };
};
