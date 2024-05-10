import { request } from '@infinity/core-sdk/lib/commonjs/utils';
import { Transaction } from '../../../networks/types';
import general from '../general';
import { TrezorParams } from './types';

const LIMIT = 100;
/**
 * Retrieves transactions for a given Trezor coin, address, last block height, and page number.
 *
 * @param {TrezorParams} param - The parameters for the transaction retrieval.
 * @param {string} param.coinId - The ID of the Trezor coin.
 * @param {string} param.address - The Trezor address to retrieve transactions for.
 * @param {string} param.lastBlockHeight - The last block height to retrieve transactions from.
 * @param {number} [param.page=1] - The page number of the transactions to retrieve.
 * @return {Promise<Transaction[]>} A promise that resolves to an array of Transaction objects.
 */
export const getTransactions = async ({
    coinId,
    address,
    lastBlockHeight,
    page = 1,
}: TrezorParams): Promise<Transaction[]> => {
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
        if (Array.isArray(result.txs)) {
            for (let tr of result.txs) {
                const decoded = general.encode({
                    transaction: tr,
                });
                transactions.push(decoded);
            }
            if (
                result.txs.length == LIMIT &&
                (!lastBlockHeight ||
                    result.txs.find(
                        (a: any) =>
                            parseInt((a.blockheight ?? a.blockHeight) + '') <
                            parseInt(lastBlockHeight),
                    ) == undefined)
            ) {
                const newTransactions = await getTransactions({
                    coinId,
                    address,
                    page: page + 1,
                    lastBlockHeight,
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
