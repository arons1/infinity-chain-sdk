import { XrplClient } from 'xrpl-client';
import {
    InvalidRawTransaction,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { SendTransactionParams } from '../sendTransaction/types';

export const sendTransactionParamsChecker = (props: SendTransactionParams) => {
    if (!props.rawTransaction || props.rawTransaction.length == 0)
        throw new Error(InvalidRawTransaction);
    if (!props.connector || !(props.connector instanceof XrplClient))
        throw new Error(MissingOrInvalidConnector);
};
