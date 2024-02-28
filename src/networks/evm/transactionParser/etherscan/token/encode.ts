import { TokenTransactionEncode } from './types';
import {Transaction} from '../../../../types'
import BigNumber from 'bignumber.js';
export const encode = ({
    transaction,
}: {
    transaction: TokenTransactionEncode;
}) : Transaction =>  {
    return {
        blockNumber: transaction.blockNumber as string,
        timeStamp: new Date(transaction.timeStamp ?? transaction.time).toISOString(),
        hash: (transaction.hash ?? transaction.transactionHash) as string,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        contractAddress: transaction.contractAddress,
        fee: new BigNumber(transaction.gasUsed ?? transaction.gasLimit).multipliedBy(transaction.gasPrice).shiftedBy(-18).toString(10),
        tokenName: transaction.tokenName,
        tokenSymbol: transaction.tokenSymbol,
        tokenDecimal: transaction.tokenDecimal,
        confirmations: transaction.confirmations,
        isError:false
    };
};
