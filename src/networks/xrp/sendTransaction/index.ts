import { AnyJson } from 'xrpl-client';
import { SendTransactionParams, TransactionResult, TxJson } from './types';
import { sendTransactionParamsChecker } from '../parametersChecker';
/*
sendTransaction
    Returns hash of the transaction broadacasted
    @param connector: XRP api connector
    @param rawTransaction: raw transaction to broadcast
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
                    else reject();
                } else {
                    reject();
                }
            })
            .catch(e => {
                console.error(e);
                reject();
            });
    });
};
