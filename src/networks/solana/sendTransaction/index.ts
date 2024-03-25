import { SendTransactionParams } from './types';
/* 
sendTransaction
    sends transaction
    @param rawTransaction: raw transaction hex
    @param connector: solana web3 connector
*/
export const sendTransaction = async ({
    connector,
    rawTransaction,
}: SendTransactionParams): Promise<string> => {
    return connector.sendRawTransaction(rawTransaction);
};
