import { GeneralApiParams } from '../../types';
import { PROVIDER } from '../constants';

export const pull = ({ address, limit, cursor }: GeneralApiParams) => {
    return {
        url: PROVIDER,
        method: 'POST',
        body: {
            market: cursor,
            command: 'account_tx',
            account: address,
            limit: limit,
            forward: false,
        },
    };
};
