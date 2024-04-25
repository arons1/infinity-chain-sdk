import { sendTransactionParametersChecker } from '../parametersChecker';
import { SendTransactionParams } from './types';

/**
 * Sends a transaction to the Solana blockchain.
 *
 * @param props - The transaction properties
 * @param {Buffer} props.rawTransaction - The raw transaction hex
 * @param {Connection} props.connector - The Solana web3 connector
 *
 * @returns {Promise<string>} The transaction signature
 */
export const sendTransaction = async (
    props: SendTransactionParams,
): Promise<string> => {
    sendTransactionParametersChecker(props);
    return props.connector.sendRawTransaction(props.rawTransaction);
};
