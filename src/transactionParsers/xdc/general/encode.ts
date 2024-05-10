import { Transaction } from '../../../networks/types';
import { GeneralTransactionEncode } from './types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

export const encode = ({
    transaction,
}: {
    transaction: GeneralTransactionEncode;
}): Transaction => {
    return {
        blockNumber: transaction.blockNumber,
        timeStamp: new Date(parseInt(transaction.timestamp)).toISOString(),
        hash: transaction.transactionHash ?? transaction.hash,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        fee: new BigNumber(transaction.gasUsed ?? transaction.gas)
            .multipliedBy(transaction.gasPrice)
            .toString(10),
        isError: transaction.error == '1',
        confirmations: transaction.confirmations,
        methodId: transaction.functionName,
        gasUsed: transaction.gasUsed,
        type: 'xdc',
    };
};
