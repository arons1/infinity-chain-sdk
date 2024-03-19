import { SendTransactionParams } from './types';

export const sendTransaction = async ({
    web3,
    rawTransaction,
}: SendTransactionParams) : Promise<number | string | null> => {
    return web3.sendRawTransaction(rawTransaction);
};
