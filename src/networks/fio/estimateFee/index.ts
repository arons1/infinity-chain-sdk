import axios, { AxiosResponse } from 'axios';
import { FeeResult } from './types';
import { FIOSDK } from '@fioprotocol/fiosdk';
import { EstimateFeeResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

const DEFAULT_FEE = FIOSDK.SUFUnit * 10;
/* 
estimateFee
    Returns fee
    @param source: source account
*/
export const estimateFee = ({
    source,
}: {
    source: string;
}): Promise<EstimateFeeResult> => {
    return new Promise(resolve => {
        axios
            .post('https://fio.blockpane.com/v1/chain/get_fee', {
                fio_public_key: source,
                end_point: 'transfer_tokens_pub_key',
            })
            .then((a: AxiosResponse<FeeResult>) => {
                if (a.data && a.data.fee) {
                    resolve({ fee: new BigNumber(a.data.fee).toString(10) });
                } else {
                    resolve({ fee: DEFAULT_FEE + '' });
                }
            })
            .catch(() => {
                resolve({ fee: DEFAULT_FEE + '' });
            });
    });
};
