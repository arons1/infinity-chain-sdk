import { request } from '@infinity/core-sdk/lib/commonjs/utils';
import { TokenTransfer, Transaction } from '../../../networks/types';
import { VechainParams } from './types';
import general from '../general';
import token from '../token';
const LIMIT = 50;
const getTransactionsGlobal = async ({
    address,
    lastTransactionHash,
    page = 1,
}: VechainParams): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    try {
        const url = general.pull({
            address,
            page,
            limit: LIMIT,
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
        if (Array.isArray(result.txs)) {
            for (let tr of result.txs) {
                const decoded = general.encode({
                    transaction: tr,
                    account: address,
                });
                transactions.push(decoded);
            }
            if (
                result.txs.length == LIMIT &&
                (!lastTransactionHash ||
                    result.txs.find(
                        (a: any) => a.txID == lastTransactionHash,
                    ) == undefined ||
                    result.txs[result.txs.length - 1].txID ==
                        lastTransactionHash)
            ) {
                const newTransactions = await getTransactionsGlobal({
                    address,
                    lastTransactionHash,
                    page: page + 1,
                });
                newTransactions.map(a => transactions.push(a));
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
    lastTransactionHash,
    page = 1,
}: VechainParams): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    try {
        const url = token.pull({
            address,
            page,
            limit: LIMIT,
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
        if (Array.isArray(result.transfers)) {
            for (let tr of result.transfers) {
                const decoded = token.encode({
                    transaction: tr,
                });
                transactions.push(decoded);
            }

            if (
                result.transfers.length == LIMIT &&
                (!lastTransactionHash ||
                    result.transfers.find(
                        (a: any) => a.txID == lastTransactionHash,
                    ) == undefined ||
                    result.transfers[result.transfers.length - 1].txID ==
                        lastTransactionHash)
            ) {
                const newTransactions = await getTransactionsToken({
                    address,
                    page: page + 1,
                    lastTransactionHash,
                });
                newTransactions.map(a => transactions.push(a));
            }
        } else {
            return transactions;
        }
    } catch (e) {
        console.error(e);
    }
    return transactions;
};

/**
 * Retrieves transactions for a given Vechain address and last transaction hash.
 *
 * @param {VechainParams} params - The parameters for the transaction retrieval.
 * @param {string} params.address - The Vechain address to retrieve transactions for.
 * @param {string} [params.lastTransactionHash] - The hash of the last transaction retrieved.
 * @return {Promise<Transaction[]>} A promise that resolves to an array of Transaction objects.
 */
export const getTransactions = async ({
    address,
    lastTransactionHash,
}: VechainParams): Promise<Transaction[]> => {
    const general = await getTransactionsGlobal({
        address,
        lastTransactionHash,
    });
    const tokens_transactions = await getTransactionsToken({
        address,
        lastTransactionHash,
    });
    tokens_transactions.map(a => {
        const transactionToEdit = general.find(b => b.hash == a.hash);
        if (transactionToEdit) {
            transactionToEdit.tokenTransfers?.push({
                ...a,
                contractAddress: transactionToEdit.extraId,
            } as TokenTransfer);
        } else {
            general.push(a);
        }
    });

    return general;
};
