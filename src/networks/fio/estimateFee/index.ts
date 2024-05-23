import axios, { AxiosResponse } from 'axios';
import { FeeResult } from './types';
import { FIOSDK } from '@fioprotocol/fiosdk';
import { EstimateFeeResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { estimateFeeParametersChecker } from '../parametersChecker';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';

const DEFAULT_FEE = FIOSDK.SUFUnit * 10;

/**
 * estimateFee
 * Returns fee
 *
 * @param {string} source - source account
 * @returns {Promise<EstimateFeeResult>}
 */
export const estimateFee = (source: string): Promise<EstimateFeeResult> => {
    estimateFeeParametersChecker(source);
    return new Promise(resolve => {
        axios
            .post(config[Coins.FIO].rpc[0] + 'chain/get_fee', {
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
            .catch(e => {
                console.error(e);
                resolve({ fee: DEFAULT_FEE + '' });
            });
    });
};
