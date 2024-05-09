import { GeneralApiParams } from '../../types';
import { PROVIDER } from '../constants';

export const pull = ({ address, limit, cursor }: GeneralApiParams) => {
    return {
        method: 'GET',
        url: `${PROVIDER}/v1/accounts/${address}/operations?limit=${limit}${cursor != undefined ? '&lastId=' + cursor : ''}`,
    };
};
