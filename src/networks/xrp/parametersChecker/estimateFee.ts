import { XrplClient } from 'xrpl-client';
import { MissingOrInvalidConnector } from '../../../errors/networks';
import { EstimateFeeParams } from '../estimateFee/types';

export const estimateFeeParametersChecker = (props: EstimateFeeParams) => {
    if (!props.connector || !(props.connector instanceof XrplClient))
        throw new Error(MissingOrInvalidConnector);
};
