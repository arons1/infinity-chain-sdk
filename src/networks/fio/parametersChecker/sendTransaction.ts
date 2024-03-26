import {
    InvalidRawTransaction,
    TransactionNotSigned,
} from '../../../errors/networks';
import { BuildTransactionFIOResult } from '../builder/types';

export const sendTransactionParametersChecker = (
    transaction: BuildTransactionFIOResult,
) => {
    if (!transaction.signatures || transaction.signatures.length == 0)
        throw new Error(TransactionNotSigned);
    if (!transaction.packed_trx || !transaction.packed_context_free_data)
        throw new Error(InvalidRawTransaction);
};
