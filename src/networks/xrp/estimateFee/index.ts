import { EstimateFeeParams } from './types';
import { EstimateFeeResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { estimateFeeParametersChecker } from '../parametersChecker/estimateFee';
/*
estimateFee
    Returns estimated fee
    @param connector: XRP api connector
*/
export const estimateFee = (props: EstimateFeeParams): EstimateFeeResult => {
    estimateFeeParametersChecker(props);
    return {
        fee: new BigNumber(
            props.connector.getState().fee.last as number,
        ).toString(10),
    };
};
