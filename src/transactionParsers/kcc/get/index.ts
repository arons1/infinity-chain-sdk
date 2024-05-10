
import { KCCParams } from './types';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import { TokenTransfer, Transaction } from '../../../networks/types';
import token from '../token';
import { request } from '@infinity/core-sdk/lib/commonjs/utils';
import general from '../general';
import internal from '../internal';
const LIMIT = 100;
const getTransactionsGlobal = async ({
    address,
    startblock,
    page = 1,
}: KCCParams): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    try {
        const url = general.pull({
            address,
            page,
            limit: LIMIT,
            startblock,
        }).url;
        const result: any = await request.get({
            url,
            no_wait: false,
            retries: 3,
            timeout: 30000,
        });
        if (result.error) {
            console.error(result);
            return transactions;
        }
        if (Array.isArray(result.result)) {
            for (let tr of result.result) {
                const decoded = general.encode({
                    transaction: tr,
                });
                transactions.push(decoded);
            }
            if (result.result.length == LIMIT) {
                const newTransactions = await getTransactionsGlobal({
                    address,
                    startblock,
                    page: page + 1,
                });
                return transactions.concat(newTransactions);
            }
        } else {
            console.log(result);
            return transactions;
        }
    } catch (e) {
        console.error(e);
    }

    return transactions;
};
const getTransactionsToken = async ({
    address,
    startblock,
    page = 1,
}: KCCParams): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];

    try {
        const url = token.pull({
            address,
            page,
            limit: LIMIT,
            startblock,
        }).url;
        const result: any = await request.get({
            url,
            no_wait: false,
            retries: 3,
            timeout: 30000,
        });
        if (result.error) {
            console.error(result);
            return transactions;
        }
        if (Array.isArray(result.result)) {
            for (let tr of result.result) {
                const decoded = token.encode({ transaction: tr });
                transactions.push(decoded);
            }

            if (result.result.length == LIMIT) {
                const newTransactions = await getTransactionsToken({
                    address,
                    startblock,
                    page: page + 1,
                });
                return transactions.concat(newTransactions);
            }
        } else {
            console.log(result);
            return transactions;
        }
    } catch (e) {
        console.error(e);
    }
    return transactions;
};

const getTransactionsInternal = async ({
    address,
    startblock,
    page = 1,
}: KCCParams): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];

    try {
        const url = internal.pull({
            address,
            page,
            limit: LIMIT,
            startblock,
        }).url;
        const result: any = await request.get({
            url,
            no_wait: false,
            retries: 3,
            timeout: 30000,
        });
        if (result.error) {
            console.error(result);
            return transactions;
        }
        if (Array.isArray(result.result)) {
            for (let tr of result.result) {
                const decoded = internal.encode({
                    transaction: tr,
                });
                transactions.push(decoded);
            }
            if (result.result.length == LIMIT) {
                const newTransactions = await getTransactionsInternal({
                    address,
                    startblock,
                    page: page + 1,
                });
                return transactions.concat(newTransactions);
            }
        } else {
            console.log(result);
            return transactions;
        }
    } catch (e) {
        console.error(e);
    }

    return transactions;
};

/**
 * Retrieves transactions for a given chain, address, and start block.
 *
 * @param {KCCParams} params - The parameters for the transaction retrieval.
 * @param {string} params.address - The address to retrieve transactions for.
 * @param {number} params.startblock - The start block number.
 * @return {Promise<Transaction[]>} A promise that resolves to an array of transactions.
 */
export const getTransactions = async ({
    address,
    startblock,
}: KCCParams): Promise<Transaction[]> => {
    const general = await getTransactionsGlobal({
        address,
        startblock,
    });
    const tokens = await getTransactionsToken({
        address,
        startblock,
    });
    tokens.map(a => {
        const transactionToEdit = general.find(b => b.hash == a.hash);
        if (transactionToEdit) {
            transactionToEdit.tokenTransfers?.push(
                a.tokenTransfers?.[0] as TokenTransfer,
            );
        } else {
            general.push(a);
        }
    });
    const internal = await getTransactionsInternal({
        address,
        startblock,
    });
    internal.map(a => {
        const transactionToEdit = general.find(b => b.hash == a.hash);
        if (transactionToEdit) {
            transactionToEdit.internalTransactions?.push({
                from: a.from as string,
                to: a.to as string,
                value: a.value,
            });
        } else {
            general.push(a);
        }
    });
    return general;
};
