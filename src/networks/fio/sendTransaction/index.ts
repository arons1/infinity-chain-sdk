import axios, { AxiosResponse } from 'axios';
import { SendTransactionParams, SendTransactionResult } from './types';

export const sendTransaction = async ({
    rawTransaction,
}: SendTransactionParams) : Promise<string> => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                'https://fio.blockpane.com/v1/chain/push_transaction',
                rawTransaction,
            )
            .then((result: AxiosResponse<SendTransactionResult>) => {
                if (result.data) {
                    resolve(result.data.transaction_id);
                } else {
                    console.error(result);
                    reject();
                }
            })
            .catch(e => {
                console.error(e);
                reject();
            });
    });
};
