import { request } from '@infinity/core-sdk/lib/commonjs/utils';
import { EffectsEncode, GeneralTransactionEncode } from '../general/types';
import { StellarParams, StellarRequestParams } from './types';
import general from '../general';
import { Transaction } from '../../../networks/types';

const LIMIT = 100;

const getTransactionsRequest = async ({
    address,
    lastTransactionHash,
    cursor,
}: StellarRequestParams): Promise<GeneralTransactionEncode[]> => {
    const resultTransactions: any = await request.get({
        url: general.pull({
            address,
            cursor,
            limit: LIMIT,
        }).url,
        no_wait: false,
        retries: 3,
        timeout: 30000,
    });
    const finalResults: GeneralTransactionEncode[] = [];
    if (resultTransactions?._embedded?.records != undefined) {
        const trs: GeneralTransactionEncode[] =
            resultTransactions?._embedded?.records;
        finalResults.concat(trs);
        if (
            trs.length == LIMIT &&
            trs.find(a => a.transaction.id == lastTransactionHash) == undefined
        ) {
            finalResults.concat(
                await getTransactionsRequest({
                    address,
                    lastTransactionHash,
                    cursor: trs[trs.length - 1].id,
                }),
            );
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
    const resultTransactions: any = await request.get({
        url: general.pullEffects({
            address,
            cursor,
            limit: LIMIT,
        }).url,
        no_wait: false,
        retries: 3,
        timeout: 30000,
    });
    const finalResults: EffectsEncode[] = [];
    if (resultTransactions?._embedded?.records != undefined) {
        const trs: EffectsEncode[] = resultTransactions?._embedded?.records;
        finalResults.concat(trs);
        if (
            trs.length == LIMIT &&
            (!lastTransactionHash || trs.find(a => a.id.split('-')[0] == lastTransactionHash) ==
                undefined || trs[trs.length - 1].id.split('-')[0] == lastTransactionHash)
        ) {
            finalResults.concat(
                await getEffectsRequest({
                    address,
                    lastTransactionHash,
                    cursor: trs[trs.length - 1].id,
                }),
            );
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
