import { AnyJson } from 'xrpl-client';
import { SendTransactionParams, TransactionResult, TxJson } from './types';
import { sendTransactionParamsChecker } from '../parametersChecker';
import { CannotSendTransaction } from '../../../errors/networks';

/**
 * Sends a transaction using the provided parameters.
 *
 * @param {SendTransactionParams} props - The parameters for the transaction.
 * @return {Promise<string>} A promise that resolves to the transaction hash if successful.
 */
export const sendTransaction = (
    props: SendTransactionParams,
): Promise<string> => {
    sendTransactionParamsChecker(props);
    const { rawTransaction, connector } = props;
    return new Promise((resolve, reject) => {
        connector
            .send(
                {
                    command: 'submit',
                    tx_blob: rawTransaction,
                },
                {
                    timeoutSeconds: 5,
                },
            )
            .then((result: AnyJson) => {
                console.log(result);
                const transactionResult = result as TransactionResult;
                if (
                    transactionResult.engine_result == 'tesSUCCESS' ||
                    transactionResult.engine_result == 'terQUEUED'
                ) {
                    const txHash = transactionResult.tx_json as TxJson;
                    if (txHash.hash) resolve(txHash.hash);
                    else reject(new Error(CannotSendTransaction));
                } else {
                    reject(new Error(transactionResult.engine_result));
                }
            })
            .catch(e => {
                console.error(e);
                reject(new Error(CannotSendTransaction));
            });
    });
};
