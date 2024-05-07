import { MissingPrivateKey } from '@infinity/core-sdk/lib/commonjs/errors';
import { BuildTransaction } from '../builder';
import { estimateParametersChecker } from './estimateFee';
import { isHexString } from '@infinity/core-sdk/lib/commonjs/core/base';

export const builderParametersChecker = (props: BuildTransaction) => {
    estimateParametersChecker(props);
    if (!props.privateKey || !isHexString(props.privateKey))
        throw new Error(MissingPrivateKey);
};
