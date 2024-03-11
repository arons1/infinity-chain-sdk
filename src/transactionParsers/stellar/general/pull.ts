import { GeneralApiParams } from '../../types';

export const pull = ({ address, limit, cursor }: GeneralApiParams) => {
    return {
        method: 'GET',
        url: `https://horizon.stellar.org/accounts/${address}/operations?join=transactions&limit=${limit}&order=desc${cursor != undefined ? '&cursor=' + cursor : ''}`,
    };
};

export const pullEffects = ({ address, limit, cursor }: GeneralApiParams) => {
    return {
        method: 'GET',
        url: `https://horizon.stellar.org/accounts/${address}/effects?limit=${limit}&order=desc${cursor != undefined ? '&cursor=' + cursor : ''}`,
    };
};
