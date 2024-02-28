import { GeneralTransactionEncode } from './types';

export const encode = ({
    transaction,
}: {
    transaction: GeneralTransactionEncode;
}) => {
    return {
        blockNumber: transaction.blockNumber,
        timeStamp: transaction.timeStamp,
        hash: transaction.hash,
        nonce: transaction.nonce,
        blockHash: transaction.blockHash,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        gasLimit: transaction.gas,
        gasPrice: transaction.gasPrice,
        isError: transaction.isError,
        contractAddress: transaction.contractAddress,
        gasUsed: transaction.gasUsed,
        confirmations: transaction.confirmations,
    };
};
