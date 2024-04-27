import { EstimateFeeParams } from './types';
import { EstimateFeeResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { estimateFeeParametersChecker } from '../parametersChecker/estimateFee';

/**
 * Estimates the fee based on the provided parameters.
 *
 * @param {EstimateFeeParams} props - The parameters for estimating the fee.
 * @return {EstimateFeeResult} The estimated fee result.
 */
export const estimateFee = (props: EstimateFeeParams): EstimateFeeResult => {
    estimateFeeParametersChecker(props);
    return {
        fee: new BigNumber(
            props.connector.getState().fee.last as number,
        ).toString(10),
    };
};
