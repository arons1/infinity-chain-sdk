import { EstimateFeeParams } from './types';
import { EstimateFeeResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
/*
estimateFee
    Returns estimated fee
    @param connector: XRP api connector
*/
export const estimateFee = ({
    connector,
}: EstimateFeeParams): EstimateFeeResult => {
    return {
        fee: new BigNumber(connector.getState().fee.last as number).toString(
            10,
        ),
    };
};
