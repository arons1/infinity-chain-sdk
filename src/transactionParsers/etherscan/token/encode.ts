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
            contractAddress: transaction.contractAddress,
            tokenName: transaction.tokenName,
            tokenSymbol: transaction.tokenSymbol,
            tokenDecimal: transaction.tokenDecimal,
            value: transaction.value,
            from: transaction.from,
            to: transaction.to,
        },
    ];
    return {
        blockNumber: transaction.blockNumber as string,
        timeStamp: new Date(
            parseInt(transaction.timeStamp ?? transaction.time) * 1000,
        ).toISOString(),
        hash: (transaction.hash ?? transaction.transactionHash) as string,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        fee: new BigNumber(transaction.gasUsed ?? transaction.gasLimit)
            .multipliedBy(transaction.gasPrice)
            .toString(10),
        tokenTransfers,
        confirmations: transaction.confirmations,
        isError: false,
        type: 'evm',
    };
};
