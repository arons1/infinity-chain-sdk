import { InternalTransactionEncode } from './types';

export const encode = ({
    transaction,
}: {
    transaction: InternalTransactionEncode;
}) => {
    return {
        blockNumber: transaction.blockNumber,
        timeStamp: transaction.timeStamp,
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        contractAddress: transaction.contractAddress,
        gasUsed: transaction.gasUsed,
        extraId: transaction.traceId,
        isError: transaction.isError,
    };
};
