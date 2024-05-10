import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { GeneralApiParams } from '../../types';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

export const pull = ({ coinId, address, page, limit }: GeneralApiParams) => {
    const coinConfig = config[coinId as Coins];
    const selected = coinConfig.apiUrl;
    if (!selected) throw new Error('Not integrated chain');
    return {
        url:
            selected +
            '/token-txs/xrc20?holder=' +
            address +
            '&page=' +
            page +
            '&limit=' +
            limit,
        method: 'GET',
    };
};
