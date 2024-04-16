import { GeneralApiParams } from '../../types';
import { PROVIDER } from '../constants';

export const pull = ({
    chainId,
    apiKey,
    address,
    page,
    limit,
    startblock = 1
}: GeneralApiParams) => {
    const selected = PROVIDER[chainId as number] as string;
    if (!selected) throw new Error('Not integrated chain');
    return {
        url:
            selected +
            '/api?module=account&apikey=' +
            apiKey +
            '&action=txlist&address=' +
            address +
            '&startblock='+startblock+'&endblock=99999999999999999999999&sort=desc&page=' +
            page +
            '&offset=' +
            limit,
        method: 'GET',
    };
};
