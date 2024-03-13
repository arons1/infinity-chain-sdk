import { Transaction } from '../../../networks/types';
import { GeneralTransactionEncode } from '../general/types';
import BigNumber from 'bignumber.js';


export const encode = ({
    transaction,
    account
}: {
    transaction: GeneralTransactionEncode;
    account:string;
}): Transaction => {
    const valueSum =  transaction.clauses.reduce((last,current) => current.to == account.toLowerCase() ? new BigNumber(last).plus(current.value) :  new BigNumber(last).minus(current.value), new BigNumber(0))
    return {
        blockNumber: transaction.blockRef,
        timeStamp: new Date(
            transaction.meta.blockTimestamp,
        ).toISOString(),
        hash: transaction.txID,
        from: transaction.origin,
        to: transaction.clauses.find(a => transaction.origin == account.toLowerCase() ? a.to != account.toLowerCase() : a.to != undefined)?.to ?? account.toLowerCase(),
        value: valueSum.toString(10),
        fee:transaction.receipt.gasPayer != account.toLowerCase() ? new BigNumber(0).toString(10) : new BigNumber(transaction.receipt.paid).toString(10),
        isError:transaction.receipt.reverted,
        confirmations: transaction.receipt.reverted ? "-1" : transaction?.meta?.blockID != undefined ? "6" : "0",
        extraId:transaction.meta.txIndex,
        type: 'vechain',
    };
};
