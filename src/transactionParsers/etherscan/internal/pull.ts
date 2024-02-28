import { PROVIDER } from '../constants';
import { GeneralApiParams } from '../../../types';

export const pull = ({
    chainId,
    apiKey,
    address,
    page,
    limit,
}: GeneralApiParams) => {
    const selected = PROVIDER[chainId] as string;
    if (!selected) throw new Error('Not integrated chain');
    return (
        PROVIDER[chainId] +
        '/api?module=account&apikey=' +
        apiKey +
        '&action=txlistinternal&address=' +
        address +
        '&startblock=1&endblock=99999999999999999999999&sort=desc&page=' +
        page +
        '&offset=' +
        limit
    );
};
