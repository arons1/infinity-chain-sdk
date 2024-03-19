import BigNumber from 'bignumber.js';
import { EstimateFeeParams } from './types';
import { EstimateFeeResult } from '../../types';

export const estimateFee = ({ api }: EstimateFeeParams): EstimateFeeResult => {
    return {
        fee:new BigNumber(api.getState().fee.last as number).toString(10)
    };
};
