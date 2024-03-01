import { Transaction } from '../../../networks/types';
import { InternalTransactionEncode } from './types';

export const encode = ({
    transaction,
}: {
    transaction: InternalTransactionEncode;
}):Transaction => {
    return {
        blockNumber: transaction.blockNumber,
        timeStamp: new Date(transaction.timeStamp ?? transaction.time).toISOString(),
        hash: (transaction.hash ?? transaction.transactionHash ?? transaction.txid) as string,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        gasUsed: transaction.gasUsed,
        extraId: transaction.traceId ?? transaction.index,
        isError: transaction.isError == "1",
        confirmations:"6",
        type:"evm"
    };
};
