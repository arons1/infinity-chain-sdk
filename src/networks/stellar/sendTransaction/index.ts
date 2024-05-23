import axios from 'axios';
import { sendTransactionParamsChecker } from '../parametersChecker';
import { CannotSendTransaction } from '../../../errors/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

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
            .post(config[Coins.STELLAR].rpc[0] + '/transactions', {
                body: new URLSearchParams({ tx: rawTransaction }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then(a => {
                if (a.data.successful) resolve(a.data.hash);
                else if (
                    a.data.extras?.result_codes?.operations != undefined &&
                    a.data.extras?.result_codes?.operations.length > 0
                )
                    reject(new Error(a.data.extras.result_codes.operations[0]));
                else if (a.data.extras?.result_codes?.transaction != undefined)
                    reject(new Error(a.data.extras.result_codes.transaction));
                else reject(new Error(CannotSendTransaction));
            })
            .catch(e => {
                console.error(e);
                reject(new Error(CannotSendTransaction));
            });
    });
};
