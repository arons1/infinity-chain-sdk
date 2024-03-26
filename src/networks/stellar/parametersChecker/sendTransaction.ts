import {
    InvalidRawTransaction,
} from '../../../errors/networks';

export const sendTransactionParamsChecker = (rawTransaction:string) => {
    if (!rawTransaction || rawTransaction.length == 0)
        throw new Error(InvalidRawTransaction);
};
