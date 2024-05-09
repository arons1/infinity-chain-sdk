import { GeneralApiParams } from '../../types';
import { PROVIDER } from '../constants';

export const pull = ({ address, limit, cursor }: GeneralApiParams) => {
    return {
        method: 'GET',
        url: `${PROVIDER}/v1/tokens/transfers?anyof.from.to=${address}&sort.desc=id&limit=${limit}${cursor != undefined ? '&lastId=' + cursor : ''}`,
    };
};
