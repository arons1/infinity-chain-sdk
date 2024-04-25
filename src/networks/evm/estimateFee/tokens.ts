import { EstimateGasTokenParams, ReturnEstimate } from './types';
import { calculateGasPrice, getGasLimit, getGasPrice, getNonce } from './utils';
import ERC20Abi from '@infinity/core-sdk/lib/commonjs/core/abi/erc20';
import { CannotGetNonce } from '../../../errors/networks';
import {
    Chains,
    TransactionEVM,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';


/**
 * estimateTokenFee
 * Returns token transfer estimate cost
 * @param {string} value Value to bridge in wei
 * @param {Web3} connector Web3 connector
 * @param {string} source Source account to send from
 * @param {string} destination Destination account to receive
 * @param {number} chainId ChainId
 * @param {number} feeRatio Ratio (between 0 and 1) to increase de fee
 * @param {number} priorityFee Account index derivation
 * @param {string} tokenContract Token contract
 * @param {string} gasPrice Gas Price (optional)
 * @param {boolean} approve Flag to approve the token
 * @returns {Promise<ReturnEstimate>} Estimated cost
 */
export const estimateTokenFee = async ({ 
    value = '0',
    connector,
    source,
    destination,
    gasPrice,
    tokenContract,
    chainId,
    feeRatio = 0.5,
    priorityFee,
    approve = false,
}: EstimateGasTokenParams): Promise<ReturnEstimate> => {
    let contract = new connector.eth.Contract(ERC20Abi, tokenContract, {
        from: source,
    });
    const { estimateGas, data } = await getGasLimit({
        source,
        destination,
        tokenContract,
        value,
        contract,
        chainId,
        connector,
        isToken: true,
        approve,
    });
    gasPrice =
        gasPrice ??
        (await getGasPrice({
            connector,
        }));

    let transaction: TransactionEVM = {
        from: source,
        to: tokenContract,
        data,
        gasLimit: estimateGas,
        value: value,
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
        gasPrice: transaction.gasPrice ?? transaction.maxFeePerGas,
        transaction,
    };
};
