import axios, { AxiosResponse } from 'axios';
import { FeeResult } from './types';

export const estimateFee = () : Promise<number> => {
    return new Promise((resolve, reject) => {
        axios
            .get('https://horizon.stellar.org/fee_stats')
            .then((a: AxiosResponse<FeeResult>) => {
                if (a.data.max_fee)
                    resolve(Math.floor(a.data.max_fee.mode * 1.1));
                else reject();
            })
            .catch(e => {
                reject(e);
            });
    });
};
