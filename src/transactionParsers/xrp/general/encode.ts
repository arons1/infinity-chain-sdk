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
    var value = transaction['tx']['Amount'];
    var from = transaction['tx']['Account'];
    var to = transaction['tx']['Destination'];
    if (transaction['tx']['TransactionType'] == 'AccountDelete') {
        value = transaction['meta']['DeliveredAmount'];
    }
    if (transaction['tx']['TransactionType'] == 'TrustSet') {
        value = '0';
        to = transaction['tx']['Account'];
    }
    var confirmations = '7';
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
        isError: false,
        type: 'xrp',
    };
};
