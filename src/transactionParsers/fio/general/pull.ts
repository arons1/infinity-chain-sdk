import { GeneralApiParams } from '../../types';
import { PROVIDER } from '../constants';
export const pull = ({ address, page, limit }: GeneralApiParams) => {
    return {
        url: PROVIDER + '/v1/history/get_actions',
        method: 'POST',
        body: {
            account_name: address,
            pos: (page as number) - (limit as number),
            offset: page,
        },
    };
};

export const initPosition = ({ address }: GeneralApiParams) => {
    return {
        url: PROVIDER + '/v1/history/get_actions',
        method: 'POST',
        body: {
            account_name: address,
            pos: -1,
        },
    };
};
