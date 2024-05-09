import { TokenTransfer, Transaction } from '../../../networks/types';
import { TokenTransactionEncode } from './types';

export const encode = ({
    transaction,
}: {
    transaction: TokenTransactionEncode;
}): Transaction => {
    const tokenTransfers: TokenTransfer[] = [
        {
            tokenName: transaction.symbol,
            tokenSymbol: transaction.symbol,
            tokenDecimal: parseInt(transaction.decimals),
            value: transaction.amount,
            from: transaction.sender,
            to: transaction.recipient,
        },
    ];
    return {
        blockNumber: transaction.meta.blockNumber + '',
        timeStamp: new Date(
            transaction.meta.blockTimestamp * 1000,
        ).toISOString(),
        hash: transaction.txID,
        tokenTransfers,
        isError: false,
        confirmations: '6',
        type: 'vechain',
    };
};
