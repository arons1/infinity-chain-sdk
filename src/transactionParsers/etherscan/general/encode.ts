import { Transaction } from '../../../networks/types';
import { GeneralTransactionEncode } from './types';
import BigNumber from 'bignumber.js';

export const encode = ({
    transaction,
}: {
    transaction: GeneralTransactionEncode;
}):Transaction => {
    return {
        blockNumber: transaction.blockNumber,
        timeStamp: new Date(transaction.timeStamp ?? transaction.time).toISOString(),
        hash: (transaction.hash ?? transaction.transactionHash) as string,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        fee: new BigNumber(transaction.gasUsed ?? transaction.gas).multipliedBy(transaction.gasPrice).shiftedBy(-18).toString(10),
        isError: transaction.isError == "1",
        confirmations: transaction.confirmations,
        type:"evm"
    };
};
