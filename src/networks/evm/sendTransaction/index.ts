import { sendTransactionParamsChecker } from '../errors';
import { SendTransactionParams } from './types';

/* 
sendTransaction
    Returns balances of the token's contracts and current balance of each address passed
    @param connector: web3 connector
    @param rawTransaction: raw transaction
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
                reject(e);
            })
            .catch((e: any) => {
                reject(e);
            });
    });
};
