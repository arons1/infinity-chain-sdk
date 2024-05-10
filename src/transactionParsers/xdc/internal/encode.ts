import { Transaction } from '../../../networks/types';
import { InternalTransactionEncode } from './types';

export const encode = ({
    transaction,
}: {
    transaction: InternalTransactionEncode;
}): Transaction => {
    return {
        blockNumber: transaction.blockNumber,
        timeStamp: new Date(parseInt(transaction.timestamp)).toISOString(),
        hash: transaction.hash,
        internalTransactions: [
            {
                from: transaction.from,
                to: transaction.to,
                value: transaction.value,
                extraId: transaction._id,
            },
        ],
        type: 'xdc',
    };
};
