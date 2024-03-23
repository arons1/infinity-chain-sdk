import { SendTransactionParams } from './types';

export const sendTransaction = async ({
    connector,
    rawTransaction,
}: SendTransactionParams): Promise<string> => {
    return connector.sendRawTransaction(rawTransaction);
};
