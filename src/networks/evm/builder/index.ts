import { TransactionEVM } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { BuildTransaction } from './types';
import { estimateFee } from '../estimateFee';
import { builderParametersChecker } from '../parametersChecker';

/**
 * buildTransaction
 *
 * Returns a transaction formatted to be sign and send
 *
 * @param {string} [value] ammount to send (optional)
 * @param {string} source source account
 * @param {string} destination destination account
 * @param {string} [data] data of the transaction (optional)
 * @param {number} chainId The ID of the chain
 * @param {Web3} connector Web3 Connector
 * @param {number} [feeRatio] Between 0 and 1, default 0.5, its the range to increase or decrease de fee, 0.5 = use default gasPrice (optional)
 * @param {number} [priorityFee] Just for chainId, 1 or 137, it's used for calculating the fee
 * @param {string} [gasPrice] It's the gas price to use (optional). Place it just when you require a fixed gasPrice.
 * @param {boolean} [approve] If it is a token approve allowance or it is a token transfer
 * @returns {Promise<string>} Returns a transaction formatted to be sign and send
 */
export const buildTransaction = async (
    props: BuildTransaction,
): Promise<string> => {
    builderParametersChecker(props);
    const gaslimit = await estimateFee(props);
    const { rawTransaction } =
        await props.connector.eth.accounts.signTransaction(
            gaslimit.transaction as TransactionEVM,
            props.privateKey,
        );
    return rawTransaction;
};

export * from './types';
