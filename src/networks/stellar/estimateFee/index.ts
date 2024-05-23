import axios, { AxiosResponse } from 'axios';
import { FeeResult } from './types';
import { EstimateFeeResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { CannotGetFeePerByte } from '../../../errors/networks';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';

/**
 * Returns fee estimate
 *
 * @returns {Promise<EstimateFeeResult>} fee estimate result
 */
export const estimateFee = (): Promise<EstimateFeeResult> => {
    return new Promise((resolve, reject) => {
        axios
            .get(config[Coins.STELLAR].rpc[0] + '/fee_stats')
            .then((a: AxiosResponse<FeeResult>) => {
                if (a.data.max_fee)
                    resolve({
                        fee: new BigNumber(a.data.max_fee.mode).toString(10),
                    });
                else reject(new Error(CannotGetFeePerByte));
            })
            .catch(e => {
                console.error(e);
                reject(new Error(CannotGetFeePerByte));
            });
    });
};
