import { TokenTransactionEncode } from './types';
import { Transaction } from '../../../networks/types';

export const encode = ({
    transaction,
}: {
    transaction: TokenTransactionEncode;
    account: string;
}): Transaction | undefined => {
    if (!transaction.token?.contract?.address) return;
    return {
        tokenTransfers: [
            {
                to: transaction.to.address,
                toAlias: transaction.to.alias,
                from: transaction.from.address,
                fromAlias: transaction.from.alias,
                value: transaction.amount,
                id: transaction.token?.id + '',
                contractAddress: transaction.token?.contract?.address,
                tokenDecimal: parseInt(transaction.token?.metadata?.decimals),
                tokenName: transaction.token?.metadata?.name,
                tokenSymbol: transaction.token?.metadata?.symbol,
            },
        ],
        extraId: transaction.transactionId + '',
        timeStamp: transaction.timestamp,
        type: 'tezos',
    };
};
