import { MissingPrivateKey } from '@infinity/core-sdk/lib/commonjs/errors';
import { BuildTransaction } from '../builder';
import { estimateParametersChecker } from './estimateFee';

export const builderParametersChecker = (props: BuildTransaction) => {
    estimateParametersChecker(props);
    if (!props.privateKey || !Buffer.isBuffer(props.privateKey))
        throw new Error(MissingPrivateKey);
};
