import { request } from '@infinity/core-sdk/lib/commonjs/utils';
import { FioParams, FioParamsPagination } from './types';
import general from '../general';
import { Transaction } from '../../../networks/types';

const getOffset = (position: number) => {
    const offset = position > 99 ? 99 : position;
    const pos = position > 99 ? position - 100 : 0;
    return {
        position: pos,
        offset,
    };
};
const initPositionCall = async (address: string) => {
    try {
        const result: any = await request.post({
            url: general.initPosition({ address }).url,
            no_wait: false,
            retries: 3,
            timeout: 30000,
            params: general.initPosition({ address }).body,
        });
        if (result.data.actions == undefined || result.data.actions.length == 0)
            return 0;
        return result.data.actions[result.data.actions.length - 1]
            .account_action_seq;
    } catch {
        return 0;
    }
};
const getTransactionsFio = async ({
    address,
    position,
    endBlock,
    offset,
}: FioParamsPagination): Promise<Transaction[]> => {
    const result: any = await request.post({
        url: general.pull({ address }).url,
        no_wait: false,
        retries: 3,
        timeout: 30000,
        params: {
            account_name: address,
            pos: position,
            offset,
        },
    });
    const transactions: Transaction[] = [];
    if (result.last_irreversible_block) {
        const last_block = result.last_irreversible_block;
        for (let tr of result.actions) {
            const parsedTransaction = general.encode({
                transaction: tr,
                last_block,
            });
            if (parsedTransaction != undefined)
                transactions.push(parsedTransaction);
        }
        if (
            position > 0 &&
            (transactions.find(a => a.blockNumber == endBlock) == undefined || transactions[transactions.length-1].blockNumber == endBlock)
        ) {
            const posResult = getOffset(position);
            const nextResult = await getTransactionsFio({
                address,
                position: posResult.position,
                endBlock,
                offset: posResult.offset,
            });
            transactions.push(...nextResult);
        }
    }
    return transactions;
};

/**
 * Retrieves transactions for a given address in the FIO blockchain.
 *
 * @param {FioParams} param - The parameters for the transaction retrieval.
 * @param {string} param.address - The FIO address to fetch transactions for.
 * @param {string} param.endBlock - The block number to stop at.
 * @return {Promise<Transaction[]>} An array of transactions for the given address.
 */
export const getTransactions = async ({
    address,
    endBlock,
}: FioParams): Promise<Transaction[]> => {
    const pos = await initPositionCall(address);
    const { position, offset } = getOffset(pos);
    return await getTransactionsFio({ address, position, offset, endBlock });
};
