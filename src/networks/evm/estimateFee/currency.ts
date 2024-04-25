import {
    Chains,
    TransactionEVM,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { CannotGetNonce } from '../../../errors/networks';
import { EstimateGasParams, ReturnEstimate } from './types';
import { calculateGasPrice, getGasLimit, getGasPrice, getNonce } from './utils';


/**
 * Estimates the cost of a currency transfer transaction.
 *
 * @param {Object} options
 * @param {string} [options.value="0"] The amount to bridge in wei.
 * @param {Web3} options.connector The Web3 connector.
 * @param {string} options.source The source account to send from.
 * @param {string} [options.destination=""] The destination account to receive.
 * @param {number} options.chainId The chain ID.
 * @param {number} [options.gasPrice] The gas price to use.
 * @param {number} [options.feeRatio=0.5] The ratio to increase the fee (between 0 and 1).
 * @param {number} [options.priorityFee] The account index derivation.
 * @returns {Promise<ReturnEstimate>} The estimated gas cost, gas price and the transaction.
 */
export const estimateCurrencyFee = async ({
    value = '0',
    connector,
    source,
    destination = '',
    chainId,
    feeRatio = 0.5,
    priorityFee,
    gasPrice,
}: EstimateGasParams): Promise<ReturnEstimate> => {
    const { estimateGas } = await getGasLimit({
        source,
        destination,
        value,
        connector,
        chainId,
        isToken: false,
    });
    gasPrice = gasPrice ?? (await getGasPrice({ connector }));
    let transaction: TransactionEVM = {
        from: source,
        to: destination,
        value: value,
        gasLimit: estimateGas,
    };
    if (chainId != Chains.VET) {
        transaction.nonce = await getNonce({
            address: source,
            connector,
        });
        if (transaction.nonce == undefined) throw new Error(CannotGetNonce);
    }
    transaction = await calculateGasPrice({
        transaction,
        gasPrice,
        connector,
        chainId,
        feeRatio,
        priorityFee,
    });
    return {
        estimateGas,
        gasPrice,
        transaction,
    };
};
