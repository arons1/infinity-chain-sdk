import {
    MissingOrInvalidConnector,
    MissingTransaction,
} from '../../../errors/networks';
import { Connection } from '@solana/web3.js';
import { SendTransactionParams } from '../sendTransaction/types';

export const sendTransactionParametersChecker = (
    props: SendTransactionParams,
) => {
    if (!props.connector || !(props.connector instanceof Connection))
        throw new Error(MissingOrInvalidConnector);
    if (!props.rawTransaction || !Buffer.isBuffer(props.rawTransaction))
        throw new Error(MissingTransaction);
};
