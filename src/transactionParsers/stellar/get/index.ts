import { request } from '@infinity/core-sdk/lib/commonjs/utils';
import { EffectsEncode, GeneralTransactionEncode } from '../general/types';
import { StellarParams, StellarRequestParams } from './types';
import general from '../general';
import { Transaction } from '../../../networks/types';
import { MAX_RETRIES, TIMEOUT } from '../../../constants';

const LIMIT = 100;
const getTransactionsRequest = async ({
    address,
    lastTransactionHash,
    cursor,
}: StellarRequestParams): Promise<GeneralTransactionEncode[]> => {
    const url = general.pull({
        address,
        cursor,
        limit: LIMIT,
    }).url;
    const resultTransactions: any = await request.get({
        url,
        no_wait: false,
        retries: MAX_RETRIES,
        timeout: TIMEOUT,
    });
    const finalResults: GeneralTransactionEncode[] = [];
    if (resultTransactions?._embedded?.records != undefined) {
        const trs: GeneralTransactionEncode[] =
            resultTransactions?._embedded?.records;
        trs.map(a => finalResults.push(a));
        if (
            trs.length == LIMIT &&
            trs.find(a => a.transaction.id == lastTransactionHash) == undefined
        ) {
            const newTransactions = await getTransactionsRequest({
                address,
                lastTransactionHash,
                cursor: trs[trs.length - 1].id,
            });
            newTransactions.map(a => finalResults.push(a));
        }
        return finalResults;
    }
    return [];
};
const getEffectsRequest = async ({
    address,
    lastTransactionHash,
    cursor,
}: StellarRequestParams): Promise<EffectsEncode[]> => {
    const url = general.pullEffects({
        address,
        cursor,
        limit: LIMIT,
    }).url;
    const resultTransactions: any = await request.get({
        url,
        no_wait: false,
        retries: MAX_RETRIES,
        timeout: TIMEOUT,
    });
    const finalResults: EffectsEncode[] = [];
    if (resultTransactions?._embedded?.records != undefined) {
        const trs: EffectsEncode[] = resultTransactions?._embedded?.records;
        trs.map(a => finalResults.push(a));
        if (
            trs.length == LIMIT &&
            (!lastTransactionHash ||
                trs.find(a => a.id.split('-')[0] == lastTransactionHash) ==
                    undefined ||
                trs[trs.length - 1].id.split('-')[0] == lastTransactionHash)
        ) {
            const newTransactions = await getEffectsRequest({
                address,
                lastTransactionHash,
                cursor: trs[trs.length - 1].id,
            });
            newTransactions.map(a => finalResults.push(a));
        }
        return finalResults;
    }
    return [];
};
/**
 * Retrieves transactions for a given Stellar address and last transaction hash.
 *
 * @param {StellarParams} param - The parameters for retrieving transactions.
 * @param {string} param.address - The Stellar address.
 * @param {string} param.lastTransactionHash - The hash of the last transaction.
 * @return {Promise<Transaction[]>} A promise that resolves to an array of transactions.
 */
export const getTransactions = async ({
    address,
    lastTransactionHash,
}: StellarParams): Promise<Transaction[]> => {
    const results: Transaction[] = [];
    const operations = await getTransactionsRequest({
        address,
        lastTransactionHash,
    });
    const effects = await getEffectsRequest({ address, lastTransactionHash });
    operations.map(a => {
        results.push(
            general.encode({
                transaction: a,
                effects,
                account: address,
            }),
        );
    });

    return results;
};
