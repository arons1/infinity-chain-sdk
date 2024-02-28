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
        'https://explorer.kcc.io/api/kcs/address/calltrans/' +
        address +
        '/' +
        page +
        '/' +
        limit
    );
};
