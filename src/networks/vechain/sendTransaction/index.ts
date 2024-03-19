import { SendTransactionParams } from './types';

export const sendTransaction = ({
    web3,
    transaction,
    privateKey,
}: SendTransactionParams) => {
    return new Promise(async (resolve, reject) => {
        const rawTransaction = await web3.eth.accounts.signTransaction(
            transaction,
            privateKey,
        );
        web3.eth
            .sendSignedTransaction(rawTransaction)
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
