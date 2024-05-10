import { TokenTransactionEncode } from './types';
import { TokenTransfer, Transaction } from '../../../networks/types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
export const encode = ({
    transaction,
}: {
    transaction: TokenTransactionEncode;
}): Transaction => {
    const tokenTransfers: TokenTransfer[] = [
        {
            contractAddress: transaction.address,
            tokenName: transaction.tokenName,
            tokenSymbol: transaction.symbol,
            tokenDecimal: transaction.tokenDecimal,
            value: transaction.value,
            from: transaction.from,
            to: transaction.to,
        },
    ];
    return {
        blockNumber: transaction.blockNumber,
        timeStamp: new Date(parseInt(transaction.timestamp)).toISOString(),
        hash: transaction.hash ?? transaction.transactionHash,
        from: transaction.from,
        to: transaction.address,
        value: '0',
        fee: new BigNumber(transaction.gasUsed ?? transaction.gasLimit)
            .multipliedBy(transaction.gasPrice)
            .toString(10),
        tokenTransfers,
        confirmations: transaction.confirmations,
        isError: false,
        type: 'xdc',
    };
};
