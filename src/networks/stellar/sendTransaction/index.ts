import axios from 'axios';
import { sendTransactionParamsChecker } from '../parametersChecker';


/**
 * Send transaction
 *
 * @param {string} rawTransaction raw transaction hex
 *
 * @returns {Promise<string>} promise which will resolve with the transaction hash
 */
export const sendTransaction = (rawTransaction: string): Promise<string> => {
    sendTransactionParamsChecker(rawTransaction);
    return new Promise((resolve, reject) => {
        axios
            .post('https://horizon.stellar.org/transactions', {
                body: new URLSearchParams({ tx: rawTransaction }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then(a => {
                if (a.data.successful) resolve(a.data.hash);
                else reject();
            })
            .catch(e => {
                reject(e);
            });
    });
};
