import { MissingPrivateKey } from '@infinity/core-sdk/lib/commonjs/errors';
import { BuildTransaction } from '../builder';
import { estimateParametersChecker } from './estimateFee';

export const buildParametersChecker = (props: BuildTransaction) => {
    estimateParametersChecker(props);
    if (!props.privateKey) throw new Error(MissingPrivateKey);
};
