import { Transaction } from '../../../networks/types';
import { InternalTransactionEncode } from './types';

/**
 * Encodes an internal transaction from Etherscan to the Infinity Chain SDK's Transaction format.
 *
 * @param {Object} params - The parameters for the encoding function.
 * @param {InternalTransactionEncode} params.transaction - The transaction object to encode.
 * @return {Transaction} The encoded transaction object.
 */
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
