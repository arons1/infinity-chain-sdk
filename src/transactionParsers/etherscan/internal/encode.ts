import { Transaction } from '../../../networks/types';
import { InternalTransactionEncode } from './types';

export const encode = ({
    transaction,
}: {
    transaction: InternalTransactionEncode;
}): Transaction => {
    return {
        hash: (transaction.hash ??
            transaction.transactionHash ??
            transaction.txid) as string,
        internalTransactions: [
            {
                from: transaction.from,
                to: transaction.to,
                value: transaction.value,
                extraId: transaction.traceId ?? transaction.index,
            },
        ],
    };
};
