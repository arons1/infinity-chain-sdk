import { BuildTransactionParams } from '../builder/types';
import { InvalidPrivateKey } from '@infinity/core-sdk/lib/commonjs/errors';
import { estimateFeeParametersChecker } from './estimateFee';

export const buildTransactionParametersChecker = (
    props: BuildTransactionParams,
) => {
    estimateFeeParametersChecker(props);
    if (
        !props.privateKey ||
        typeof props.privateKey != 'string' ||
        props.privateKey.length == 0
    )
        throw new Error(InvalidPrivateKey);
};
