import { isValidNumber } from '@infinity/core-sdk/lib/commonjs/utils';
import { BuildTransactionParams } from '../builder/types';
import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/fio';
import { InvalidAddress, InvalidAmount } from '../../../errors/networks';
import { MissingPrivateKey } from '@infinity/core-sdk/lib/commonjs/errors';

export const buildParametersChecker = (props: BuildTransactionParams) => {
    if (!isValidNumber(props.value)) throw new Error(InvalidAmount);
    if (!isValidAddress(props.source)) throw new Error(InvalidAddress);
    if (!isValidAddress(props.destination)) throw new Error(InvalidAddress);
    if (!props.privateKey || !Buffer.isBuffer(props.privateKey))
        throw new Error(MissingPrivateKey);
};
