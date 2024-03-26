import { XrplClient } from 'xrpl-client';
import {
    InvalidAddress,
    InvalidMemo,
    InvalidNumber,
    MissingOrInvalidConnector,
    MissingTransaction,
} from '../../../errors/networks';
import { BuildTransactionParams, PreparePaymentParams } from '../builder/types';
import { isValidNumber } from '@infinity/core-sdk/lib/commonjs/utils';
import {
    isValidAddress,
    isValidMemo,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/xrp';
import { InvalidPrivateKey } from '@infinity/core-sdk/lib/commonjs/errors';

export const builderParametersChecker = (props: BuildTransactionParams) => {
    if (!props.connector || !(props.connector instanceof XrplClient))
        throw new Error(MissingOrInvalidConnector);
    if (!isValidNumber(props.amount)) throw new Error(InvalidNumber);
    if (!isValidAddress(props.from)) throw new Error(InvalidAddress);
    if (!isValidAddress(props.to)) throw new Error(InvalidAddress);
    if (props.memo && !isValidMemo(props.memo)) throw new Error(InvalidMemo);
    if (!props.keyPair?.privateKey) throw new Error(InvalidPrivateKey);
};
export const preparePaymentParametersChecker = (
    props: PreparePaymentParams,
) => {
    if (!props.connector || !(props.connector instanceof XrplClient))
        throw new Error(MissingOrInvalidConnector);
    if (!props.tx) throw new Error(MissingTransaction);
};
