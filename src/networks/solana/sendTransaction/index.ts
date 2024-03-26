import { sendTransactionParametersChecker } from '../parametersChecker';
import { SendTransactionParams } from './types';
/* 
sendTransaction
    sends transaction
    @param rawTransaction: raw transaction hex
    @param connector: solana web3 connector
*/
export const sendTransaction = async (
    props: SendTransactionParams,
): Promise<string> => {
    sendTransactionParametersChecker(props);
    return props.connector.sendRawTransaction(props.rawTransaction);
};
