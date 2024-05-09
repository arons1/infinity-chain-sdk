import { GeneralTransactionEncode } from './types';
import { Transaction } from '../../../networks/types';

export const encode = ({
    transaction,
}: {
    transaction: GeneralTransactionEncode;
}): Transaction | undefined => {
    if (
        transaction['tx']['TransactionType'] != 'Payment' &&
        transaction['tx']['TransactionType'] != 'AccountDelete' &&
        transaction['tx']['TransactionType'] != 'TrustSet'
    )
        return;
    let value = transaction['tx']['Amount'];
    let from = transaction['tx']['Account'];
    let to = transaction['tx']['Destination'];
    if (transaction['tx']['TransactionType'] == 'AccountDelete') {
        value = transaction['meta']['DeliveredAmount'];
    }
    if (transaction['tx']['TransactionType'] == 'TrustSet') {
        value = '0';
        to = transaction['tx']['Account'];
    }
    let confirmations = '7';
    if (
        transaction['validated'] != undefined &&
        transaction['validated'] == false
    )
        confirmations = '0';
    if (
        from == to ||
        transaction['meta']['TransactionResult'] != 'tesSUCCESS'
    ) {
        value = '0';
    }
    return {
        blockNumber: transaction.tx.ledger_index,
        timeStamp: new Date(
            transaction['tx']['date'] + 946684800,
        ).toISOString(),
        hash: transaction['tx']['hash'],
        from,
        to,
        value,
        fee: transaction['tx']['Fee'],
        confirmations,
        isError: transaction['meta']['TransactionResult'] != 'tesSUCCESS',
        type: 'xrp',
    };
};
