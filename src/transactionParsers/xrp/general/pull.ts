import { GeneralApiParams } from '../../types';

export const pull = ({
    address,
    limit,
    cursor
}: GeneralApiParams) => {
    return `https://horizon.stellar.org/accounts/${address}/operations?join=transactions&limit=${limit}&order=desc${cursor != undefined ? "&cursor="+cursor : ""}`;
};

