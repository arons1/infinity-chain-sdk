import { EtherscanParams } from './types';
import { TokenTransfer, Transaction } from '../../../networks/types';
import general from '../general';
import token from '../token';
import internal from '../internal';
import { request } from '@infinity/core-sdk/lib/commonjs/utils';

const LIMIT = 100;
const getTransactionsGlobal = async ({
    coinId,
    address,
    lastTransactionHash,
    page = 1,
}: EtherscanParams): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    try {
        const url = general.pull({
            coinId,
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
        if (Array.isArray(result.items)) {
            for (let tr of result.items) {
                const decoded = general.encode({
                    transaction: tr,
                });
                transactions.push(decoded);
            }
            if (result.items.length == LIMIT && result.items.find((b:any) => b.hash == lastTransactionHash) == undefined) {
                const newTransactions = await getTransactionsGlobal({
                    coinId,
                    address,
                    lastTransactionHash,
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
    coinId,
    address,
    lastTransactionHash,
    page = 1,
}: EtherscanParams): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];

    try {
        const url = token.pull({
            coinId,
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
        if (Array.isArray(result.result)) {
            for (let tr of result.result) {
                const decoded = token.encode({ transaction: tr });
                transactions.push(decoded);
            }
            if (result.result.length == LIMIT && result.items.find((b:any) => b.hash == lastTransactionHash) == undefined) {
                const newTransactions = await getTransactionsToken({
                    coinId,
                    address,
                    lastTransactionHash,
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
    coinId,
    address,
    lastTransactionHash,
    page = 1,
}: EtherscanParams): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    try {
        const url = internal.pull({
            coinId,
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
        if (Array.isArray(result.result)) {
            for (let tr of result.result) {
                const decoded = internal.encode({
                    transaction: tr,
                });
                transactions.push(decoded);
            }
            if (result.result.length == LIMIT && result.items.find((b:any) => b.hash == lastTransactionHash) == undefined) {
                const newTransactions = await getTransactionsInternal({
                    coinId,
                    address,
                    lastTransactionHash,
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
 * Retrieves transactions from Etherscan for a given chain, address, and start block.
 *
 * @param {EtherscanParams} param - The parameters for the transaction retrieval.
 * @param {number} param.coinId - The ID of the chain.
 * @param {string} param.address - The address to retrieve transactions for.
 * @param {number} param.lastTransactionHash - The start block to retrieve transactions from.
 * @return {Promise<Transaction[]>} A promise that resolves to an array of transactions.
 */
export const getTransactions = async ({
    coinId,
    address,
    lastTransactionHash,
}: EtherscanParams): Promise<Transaction[]> => {
    const general = await getTransactionsGlobal({
        coinId,
        address,
        lastTransactionHash,
    });
    const tokens = await getTransactionsToken({
        coinId,
        address,
        lastTransactionHash,
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
        coinId,
        address,
        lastTransactionHash,
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
