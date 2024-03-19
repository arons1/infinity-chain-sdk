import { GeneralApiParams } from '../../types';
import { PROVIDER } from '../constants';

export const pull = ({ address, limit, cursor }: GeneralApiParams) => {
    return {
        method: 'GET',
        url: `${PROVIDER}/accounts/${address}/operations?join=transactions&limit=${limit}&order=desc${cursor != undefined ? '&cursor=' + cursor : ''}`,
    };
};

export const pullEffects = ({ address, limit, cursor }: GeneralApiParams) => {
    return {
        method: 'GET',
        url: `${PROVIDER}/accounts/${address}/effects?limit=${limit}&order=desc${cursor != undefined ? '&cursor=' + cursor : ''}`,
    };
};
