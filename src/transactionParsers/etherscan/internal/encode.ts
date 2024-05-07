import { Transaction } from '../../../networks/types';
import { InternalTransactionEncode } from './types';

export const encode = ({
    transaction,
}: {
    transaction: InternalTransactionEncode;
}): Transaction => {
    return {
        blockNumber: transaction.blockNumber as string,
        timeStamp: new Date(
            parseInt(transaction.timeStamp ?? transaction.time) * 1000,
        ).toISOString(),
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
