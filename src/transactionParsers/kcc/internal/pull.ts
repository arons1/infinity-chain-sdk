import { GeneralApiParams } from '../../types';
import { PROVIDER_INTERNAL } from '../constants';

export const pull = ({ address, page, limit }: GeneralApiParams) => {
    return {
        url:
            PROVIDER_INTERNAL +
            '/api/kcs/address/calltrans/' +
            address +
            '/' +
            page +
            '/' +
            limit,
        method: 'GET',
    };
};
