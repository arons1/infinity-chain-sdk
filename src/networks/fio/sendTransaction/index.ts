import axios, { AxiosResponse } from 'axios';
import { SendTransactionResult } from './types';
import { sendTransactionParametersChecker } from '../parametersChecker';
import { BuildTransactionFIOResult } from '../builder/types';

/**
 * sendTransaction
 *
 * Sends transaction
 *
 * @param {BuildTransactionFIOResult} transaction Raw transaction hex
 * @return {Promise<string>} Transaction ID
 */
export const sendTransaction = async (
    transaction: BuildTransactionFIOResult,
): Promise<string> => {
    sendTransactionParametersChecker(transaction);
    return new Promise((resolve, reject) => {
        axios
            .post(
                'https://fio.blockpane.com/v1/chain/push_transaction',
                transaction,
            )
            .then((result: AxiosResponse<SendTransactionResult>) => {
                if (result.data) {
                    resolve(result.data.transaction_id);
                } else {
                    console.error(result);
                    reject(result);
                }
            })
            .catch(e => {
                console.error(e);
                reject(e);
            });
    });
};
