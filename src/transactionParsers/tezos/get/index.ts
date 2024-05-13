import { request } from '@infinity/core-sdk/lib/commonjs/utils';
import {
    GeneralTransactionEncode,
    TokenTransactionEncode,
} from '../general/types';
import { TezosParams, TezosRequestParams } from './types';
import general from '../general';
import { Transaction } from '../../../networks/types';
import token from '../token';

const LIMIT = 100;

const getTransactionsRequest = async ({
    address,
    lastTransactionHash,
    cursor,
}: TezosRequestParams): Promise<GeneralTransactionEncode[]> => {
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
    if (resultTransactions != undefined) {
        const trs: GeneralTransactionEncode[] = resultTransactions;
        trs.map(a => finalResults.push(a));
        if (
            trs.length == LIMIT &&
            (trs.find(a => a.id + '' == lastTransactionHash) == undefined ||
                trs[trs.length - 1].id + '' == lastTransactionHash)
        ) {
            const newTransactions = await getTransactionsRequest({
                address,
                lastTransactionHash,
                cursor: trs[trs.length - 1].id + '',
            });
            newTransactions.map(a => finalResults.push(a));
        }
        return finalResults;
    }
    return [];
};
const getTransactionsTokenRequest = async ({
    address,
    lastTransactionHash,
    cursor,
}: TezosRequestParams): Promise<TokenTransactionEncode[]> => {
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
    const finalResults: TokenTransactionEncode[] = [];
    if (resultTransactions != undefined) {
        const trs: TokenTransactionEncode[] = resultTransactions;
        trs.map(a => finalResults.push(a));
        if (
            trs.length == LIMIT &&
            (!lastTransactionHash ||
                trs.find(a => a.id + '' == lastTransactionHash) == undefined ||
                trs[trs.length - 1].id + '' == lastTransactionHash)
        ) {
            const newTransactions = await getTransactionsTokenRequest({
                address,
                lastTransactionHash,
                cursor: trs[trs.length - 1].id + '',
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
 * @param {TezosParams} param - The parameters for retrieving transactions.
 * @param {string} param.address - The Stellar address.
 * @param {string} param.lastTransactionHash - The hash of the last transaction.
 * @return {Promise<Transaction[]>} A promise that resolves to an array of transactions.
 */
export const getTransactions = async ({
    address,
    lastTransactionHash,
}: TezosParams): Promise<Transaction[]> => {
    const results: Transaction[] = [];
    const operations = await getTransactionsRequest({
        address,
        lastTransactionHash,
    });
    operations.map(a => {
        const tr = general.encode({
            transaction: a,
            account: address,
        });
        if (tr) results.push(tr);
    });
    const tokens = await getTransactionsTokenRequest({
        address,
        lastTransactionHash,
    });
    tokens.map(a => {
        const tk = token.encode({
            transaction: a,
            account: address,
        });
        if (tk && tk.from != address) {
            const transaction = results.find(a => a.extraId == tk.extraId);
            if (!transaction) {
                results.push(tk);
            } else {
                transaction.tokenTransfers?.map(b => {
                    if (
                        b.id == tk.tokenTransfers?.[0]?.id &&
                        b.contractAddress ==
                            tk.tokenTransfers?.[0]?.contractAddress
                    ) {
                        b.tokenDecimal = tk.tokenTransfers?.[0]?.tokenDecimal;
                        b.tokenName = tk.tokenTransfers?.[0]?.tokenName;
                        b.tokenSymbol = tk.tokenTransfers?.[0]?.tokenSymbol;
                    }
                });
            }
        }
    });
    return results;
};
