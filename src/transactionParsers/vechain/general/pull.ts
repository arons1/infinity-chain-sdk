import { GeneralApiParams } from '../../types';

export const pull = ({ address, page, limit }: GeneralApiParams) => {
    return {
        method: 'GET',
        url: `https://explore.vechain.org/api/accounts/${address.toLowerCase()}/transactions?limit=${limit}${'&offset=' + (page ?? 0)}`,
    };
};

export const pullTransactionInfo = (transactionHash: string) =>
    'https://explore.vechain.org/api/transactions/' + transactionHash;
