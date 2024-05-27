import { Transaction } from '../../../networks/types';
import { GeneralTransactionEncode } from './types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

/**
 * Encodes a general transaction from Etherscan to the Infinity Chain SDK's Transaction format.
 *
 * @param {Object} params - The parameters for the encoding function.
 * @param {GeneralTransactionEncode} params.transaction - The transaction object to encode.
 * @return {Transaction} The encoded transaction object.
 */
export const encode = ({
    transaction,
}: {
    transaction: GeneralTransactionEncode;
}): Transaction => {
    return {
        blockNumber: transaction.blockNumber,
        timeStamp: new Date(
            parseInt(transaction.timeStamp ?? transaction.time) * 1000,
        ).toISOString(),
        hash: (transaction.hash ?? transaction.transactionHash) as string,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        fee: new BigNumber(transaction.gasUsed ?? transaction.gas)
            .multipliedBy(transaction.gasPrice)
            .toString(10),
        isError: transaction.isError == '1',
        confirmations: transaction.confirmations,
        methodId: transaction.functionName,
        type: 'evm',
    };
};
