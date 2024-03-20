import { EstimateFeeParams } from './types';
import { EstimateFeeResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

export const estimateFee = ({ api }: EstimateFeeParams): EstimateFeeResult => {
    return {
        fee: new BigNumber(api.getState().fee.last as number).toString(10),
    };
};
