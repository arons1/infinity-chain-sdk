import axios from 'axios';
import { SendTransactionResult } from './types';

export const sendTransaction = (
    rawTransaction: string,
): Promise<SendTransactionResult> => {
    return new Promise((resolve, reject) => {
        axios
            .post('https://horizon.stellar.org/transactions', {
                body: new URLSearchParams({ tx: rawTransaction }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then(a => {
                resolve(a.data);
            })
            .catch(e => {
                reject(e);
            });
    });
};
