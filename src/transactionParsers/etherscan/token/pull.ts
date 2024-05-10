import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { GeneralApiParams } from '../../types';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

export const pull = ({
    coinId,
    address,
    page,
    limit,
    startblock = '1',
}: GeneralApiParams) => {
    const coinConfig = config[coinId as Coins];
    const selected = coinConfig.apiUrl;
    if (!selected) throw new Error('Not integrated chain');
    return {
        url:
            selected +
            '/api?module=account' +
            (coinConfig.apiKey != undefined
                ? '&apikey=' + coinConfig.apiKey
                : '') +
            '&action=tokentx&address=' +
            address +
            '&startblock=' +
            startblock +
            '&endblock=99999999999999999999999&sort=desc&page=' +
            page +
            '&offset=' +
            limit,
        method: 'GET',
    };
};
