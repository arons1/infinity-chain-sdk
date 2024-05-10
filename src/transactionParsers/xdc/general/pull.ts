import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { GeneralApiParams } from '../../types';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

export const pull = ({ address, page, limit }: GeneralApiParams) => {
    const coinConfig = config[Coins.XDC];
    const selected = coinConfig.apiUrl;
    if (!selected) throw new Error('Not integrated chain');
    return {
        url:
            selected +
            '/txs/listByAccount/' +
            address +
            '?page=' +
            page +
            '&limit=' +
            limit,
        method: 'GET',
    };
};
