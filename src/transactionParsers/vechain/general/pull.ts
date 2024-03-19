import { GeneralApiParams } from '../../types';
import { PROVIDER } from '../constants';

export const pull = ({ address, page, limit }: GeneralApiParams) => {
    return {
        method: 'GET',
        url: `${PROVIDER}/api/accounts/${address.toLowerCase()}/transactions?limit=${limit}${'&offset=' + (page ?? 0)}`,
    };
};

export const pullTransactionInfo = (transactionHash: string) =>
    `${PROVIDER}/api/transactions/${transactionHash}`;
