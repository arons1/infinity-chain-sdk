import { GeneralApiParams } from '../../types';

export const pull = ({ address, page, limit }: GeneralApiParams) => {
    return {
        method: 'GET',
        url: `https://explore.vechain.org/api/accounts/${address.toLowerCase()}/transfers?limit=${limit}${'&offset=' + (page ?? 0)}`,
    };
};
