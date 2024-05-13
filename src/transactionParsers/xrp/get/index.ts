import { Transaction } from '../../../networks/types';
import general from '../general';
import { GeneralTransactionEncode } from '../general/types';
import { QueryParameters, XrpParams } from './types';

const LIMIT = 100;
/**
 * Retrieves transactions based on the provided parameters.
 *
 * @param {XrpParams} connector - The connector object.
 * @param {XrpParams} address - The address to fetch transactions for.
 * @param {string} lastTransactionHash - The hash of the last transaction.
 * @param {string} cursor - The cursor for pagination.
 * @return {Promise<Transaction[]>} An array of transactions.
 */
export const getTransactions = async ({
    connector,
    address,
    lastTransactionHash,
    cursor,
}: XrpParams): Promise<Transaction[]> => {
    let objectTransaction = {
        command: 'account_tx',
        account: address,
        limit: LIMIT,
        forward: false,
    } as QueryParameters;
    if (cursor != undefined) objectTransaction.marker = cursor;
    const result = await connector.send(objectTransaction, {
        timeoutSeconds: 30,
    });
    const transactions: Transaction[] = [];
    result.transactions.forEach((transaction: GeneralTransactionEncode) => {
        const tr = general.encode({ transaction });
        if (tr != undefined) transactions.push(tr);
    });
    if (
        (!lastTransactionHash ||
            result.transactions.find(
                (a: any) => a.hash == lastTransactionHash,
            ) == undefined ||
            result.transactions[result.transactions.length - 1].hash ==
                lastTransactionHash) &&
        result.transactions.length == LIMIT
    ) {
        const newTransactions = await getTransactions({
            connector,
            address,
            lastTransactionHash,
            cursor: result.marker,
        });
        newTransactions.map(a => transactions.push(a));
    }
    return transactions;
};
