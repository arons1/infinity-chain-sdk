import axios, { AxiosResponse } from 'axios';
import { SendTransactionResult } from './types';
import { sendTransactionParametersChecker } from '../parametersChecker';
import { BuildTransactionFIOResult } from '../builder/types';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import {
    CannotSendTransaction,
    InvalidRawTransaction,
} from '../../../errors/networks';
import { NotEnoughBalance } from '../../../errors/rpc_errors/solana';
import {
    AuthorizationError,
    DuplicatedTransaction,
    ExpiredTransaction,
} from '../../../errors/rpc_errors/fio';

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
                config[Coins.FIO].rpc[0] + 'chain/push_transaction',
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
            .catch(error => {
                console.error(error);
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.error
                ) {
                    const errorCode = error.response.data.error.what;
                    switch (errorCode) {
                        case 'Invalid packed transaction':
                            throw new Error(InvalidRawTransaction);
                        case 'expired_tx_exception':
                            throw new Error(ExpiredTransaction);
                        case 'tx_duplicate':
                            throw new Error(DuplicatedTransaction);
                        case 'tx_not_permitted':
                            throw new Error(AuthorizationError);
                        case 'insufficient_resources':
                            throw new Error(NotEnoughBalance);
                        default:
                            throw new Error(CannotSendTransaction);
                    }
                } else {
                    throw new Error(CannotSendTransaction);
                }
            });
    });
};
