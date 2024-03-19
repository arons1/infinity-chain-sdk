import { GeneralApiParams } from '../../types';
import { PROVIDER } from '../constants';

export const pull = ({ address, page, limit }: GeneralApiParams) => {
    return {
        method: 'GET',
        url: `${PROVIDER}/api/accounts/${address.toLowerCase()}/transfers?limit=${limit}${'&offset=' + (page ?? 0)}`,
    };
};
