import { GeneralApiParams } from '../../types';

export const pull = ({ address, limit, cursor }: GeneralApiParams) => {
    return {
        url: `https://s1.ripple.com:51234`,
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
