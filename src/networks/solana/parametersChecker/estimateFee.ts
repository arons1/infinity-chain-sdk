import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import { EstimateFeeParams } from '../estimateFee/types';
import {
    MissingOrInvalidConnector,
    MissingTransaction,
} from '../../../errors/networks';

export const estimateFeeParametersChecker = (props: EstimateFeeParams) => {
    if (!props.connector || !(props.connector instanceof Connection))
        throw new Error(MissingOrInvalidConnector);
    if (!props.transaction) throw new Error(MissingTransaction);
    if (
        !(props.transaction instanceof Transaction) &&
        !(props.transaction instanceof VersionedTransaction)
    )
        throw new Error(MissingTransaction);
};
