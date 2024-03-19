import axios, { AxiosResponse } from 'axios';
import { FeeResult } from './types';
import { EstimateFeeResult } from '../../types';
import BigNumber from 'bignumber.js';

export const estimateFee = (): Promise<EstimateFeeResult> => {
    return new Promise((resolve, reject) => {
        axios
            .get('https://horizon.stellar.org/fee_stats')
            .then((a: AxiosResponse<FeeResult>) => {
                if (a.data.max_fee)
                    resolve({
                        fee: new BigNumber(a.data.max_fee.mode).toString(10),
                    });
                else reject();
            })
            .catch(e => {
                reject(e);
            });
    });
};
