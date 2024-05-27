import { TokenTransactionEncode } from './types';
import { TokenTransfer, Transaction } from '../../../networks/types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
/**
 * Encodes a token transaction from Etherscan to the Infinity Chain SDK's Transaction format.
 *
 * @param {Object} params - The parameters for the encoding function.
 * @param {TokenTransactionEncode} params.transaction - The token transaction object to encode.
 * @return {Transaction} The encoded transaction object.
 */
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
        to: transaction.contractAddress,
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
