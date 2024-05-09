import { TokenTransfer, Transaction } from '../../../networks/types';
import { TokenTransactionEncode } from './types';

export const encode = ({
    transaction,
}: {
    transaction: TokenTransactionEncode;
}): Transaction => {
    const tokenTransfers: TokenTransfer[] = [
        {
            tokenName: transaction.name,
            tokenSymbol: transaction.symbol,
            tokenDecimal: transaction.decimals,
            value: transaction.amount,
            from: transaction.sender,
            to: transaction.recipient,
        },
    ];
    return {
        blockNumber: transaction.meta.blockNumber as string,
        timeStamp: new Date(
            parseInt(transaction.meta.blockTimestamp) * 1000,
        ).toISOString(),
        hash: transaction.txID,
        tokenTransfers,
        isError: false,
        confirmations: '6',
        type: 'vechain',
    };
};
