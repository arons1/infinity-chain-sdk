import { TokenTransactionEncode } from './types';

export const encode = ({
    transaction,
}: {
    transaction: TokenTransactionEncode;
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
        blockHash: transaction.blockHash,
        tokenName: transaction.tokenName,
        tokenSymbol: transaction.tokenSymbol,
        tokenDecimal: transaction.tokenDecimal,
        gasLimit: transaction.gasLimit,
        gasPrice: transaction.gasPrice,
        confirmations: transaction.confirmations,
    };
};
