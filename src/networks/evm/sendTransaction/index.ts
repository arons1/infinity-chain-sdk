import { SendTransactionParams } from './types';

export const sendTransaction = async ({
    web3,
    transaction,
    privateKey,
}: SendTransactionParams): Promise<string> => {
    const { rawTransaction } = await web3.eth.accounts.signTransaction(
        transaction,
        privateKey,
    );
    return new Promise((resolve, reject) => {
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
