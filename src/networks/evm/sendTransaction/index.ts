import { CannotSendTransaction } from '../../../errors/networks';
import { sendTransactionParamsChecker } from '../parametersChecker';
import { SendTransactionParams } from './types';

/**
 * sendTransaction
 *
 * Returns balances of the token's contracts and current balance of each address passed
 *
 * @param {Web3} connector       Web3 connector
 * @param {string} rawTransaction  Raw transaction
 */
export const sendTransaction = async (
    props: SendTransactionParams,
): Promise<string> => {
    sendTransactionParamsChecker(props);
    return new Promise((resolve, reject) => {
        props.connector.eth
            .sendSignedTransaction(props.rawTransaction)
            .once('transactionHash', (txid: string) => {
                resolve(txid);
            })
            .on('error', (e: any) => {
                reject(new Error(e.code ?? CannotSendTransaction));
            })
            .catch((e: any) => {
                reject(new Error(e.code ?? CannotSendTransaction));
            });
    });
};
