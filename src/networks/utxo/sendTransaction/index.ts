import { SendTransactionParams } from './types';

/**
 * Sends a transaction using the provided connector and raw transaction.
 *
 * @param {SendTransactionParams} params - The parameters for sending the transaction.
 * @param {Connector} params.connector - The connector used to send the transaction.
 * @param {string} params.rawTransaction - The raw transaction to be sent.
 * @return {Promise<string>} A promise that resolves with the transaction result or rejects if an error occurs.
 */
export const sendTransaction = ({
    connector,
    rawTransaction,
}: SendTransactionParams): Promise<string> => {
    return new Promise((resolve, reject) => {
        connector.send(
            'sendTransaction',
            {
                hex: rawTransaction,
            },
            async (result: any) => {
                if (result?.result != undefined) resolve(result.result);
                else reject();
            },
        );
    });
};
