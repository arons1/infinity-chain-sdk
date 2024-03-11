import { GeneralApiParams } from '../../types';
import { PROVIDER } from '../constants';

export const pull = ({
    chainId,
    address,
    page,
    limit,
}: GeneralApiParams) => {
    const selected = PROVIDER[chainId as number] as string;
    if (!selected) throw new Error('Not integrated chain');
    return {
        url:'https://explorer.kcc.io/api/kcs/address/calltrans/' +
        address +
        '/' +
        page +
        '/' +
        limit,
        method:"GET"
    }
};
