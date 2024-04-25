import {
    CalculateGasPrice,
    GasLimitParams,
    GasPriceParams,
    NonceParams,
} from './types';
import {
    CannotGetNonce,
    InvalidAddress,
    InvalidAmount,
    InvalidContractAddress,
    InvalidTokenContract,
    PriorityFeeError,
} from '../../../errors/networks';

import {
    Chains,
    TransactionEVM,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/evm';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { isValidNumber } from '@infinity/core-sdk/lib/commonjs/utils';
import Web3 from 'web3';

/**
 * Calculate Gas Price
 * Format gas price based on the current transaction
 * @param {TransactionEVM} transaction 
 * @param {string} gasPrice
 * @param {Web3} connector
 * @param {number} chainId
 * @param {number} [feeRatio=0.5]
 * @param {string|undefined} [priorityFee]
 * @returns {Promise<TransactionEVM>}
 */
export const calculateGasPrice = async ({ 
    transaction,
    gasPrice,
    connector,
    chainId,
    feeRatio = 0.5,
    priorityFee,
}: CalculateGasPrice): Promise<TransactionEVM> => {
    if (chainId == Chains.ETH || chainId == Chains.MATIC) {
        if (!isValidNumber(priorityFee)) throw new Error(PriorityFeeError);
        const maxPriority = connector.utils.toHex(
            new BigNumber(priorityFee as string)
                .multipliedBy(feeRatio + 1)
                .toString(10)
                .split('.')[0],
        );
        transaction.maxPriorityFeePerGas = maxPriority;
        transaction.maxFeePerGas = new BigNumber(maxPriority)
            .plus(new BigNumber(gasPrice).multipliedBy(1 + feeRatio))
            .toString(10);
        transaction.maxFeePerGas = connector.utils.toHex(
            new BigNumber(transaction.maxFeePerGas).toString(10).split('.')[0],
        );
        delete transaction.gasPrice;
    } else {
        transaction.gasPrice = connector.utils.toHex(gasPrice);
    }

    if (transaction.value)
        transaction.value =
            '0x' + new BigNumber(transaction.value).toString(16);
    return transaction;
};

/**
 * getGasPrice
 * Returns gas price
 * @param {Web3} connector Web3 connector
 * @returns {Promise<string>} Gas price
 */
export const getGasPrice = async ({ connector }:GasPriceParams) => {
    return '0x' + (await connector.eth.getGasPrice()).toString(16);
};


/**
 * estimateGas
 * Returns gas limit estimate cost
 * @param {Web3} connector Web3 connector
 * @param {number} chainId ChainId
 * @param {TransactionEVM} tx TransactionEVM
 * @returns {Promise<string>} Gas limit estimate cost
 */
const estimateGas = async (
    connector: Web3,
    chainId: number,
    tx: TransactionEVM,
) => {
    const auxCalc = { ...tx };
    if (chainId == Chains.VET) {
        delete auxCalc.nonce;
    }
    tx.gasLimit =
        '0x' + (await connector.eth.estimateGas(auxCalc)).toString(16);
    return tx.gasLimit;
};

/**
 * getGasLimit
 *
 * Returns gas limit estimate cost
 *
 * @param {Object} params
 * @param {string} params.destination - destination account to receive
 * @param {string} params.tokenContract - token contract
 * @param {string} params.value - Amount to bridge in wei
 * @param {string} params.source - source account to send from
 * @param {Contract} params.contract - Web3 contract
 * @param {number} params.chainId - chainId
 * @param {Web3} params.connector - web3 connector
 * @param {boolean} [params.isToken=false] - If it's a token transfer
 * @param {boolean} [params.approve=false] - If it's an approve
 *
 * @returns {Promise<{data: string, estimateGas: string}>}
 */
export const getGasLimit = async ({
    destination,
    tokenContract,
    value,
    source,
    contract,
    chainId,
    connector,
    isToken = false,
    approve = false,
}: GasLimitParams): Promise<{
    data: string;
    estimateGas: string;
}> => {
    if (!isValidAddress(source)) throw new Error(InvalidAddress);
    if (!isValidNumber(value)) throw new Error(InvalidAmount);
    if (!isValidAddress(destination)) throw new Error(InvalidAddress);
    if (isToken) {
        if (!isValidAddress(tokenContract as string))
            throw new Error(InvalidContractAddress);
        if (!contract) throw new Error(InvalidTokenContract);
        const nonce = await getNonce({ address: source, connector });
        if (!nonce) throw new Error(CannotGetNonce);
        const data = approve
            ? contract.methods.approve(destination, value).encodeABI()
            : contract.methods.transfer(destination, value).encodeABI();
        const estimateGasNormal = await estimateGas(connector, chainId, {
            from: source,
            nonce: nonce,
            to: tokenContract as string,
            data,
        });
        return {
            data,
            estimateGas: estimateGasNormal,
        };
    } else {
        const tx: TransactionEVM = {
            from: source,
            to: destination,
            value: '0x' + new BigNumber(value).toString(16),
        };
        if (chainId != Chains.VET) {
            const nonce = await getNonce({ address: source, connector });
            if (nonce == undefined) throw new Error(CannotGetNonce);
            tx.nonce = nonce;
        }
        const estimateGasNormal = await estimateGas(connector, chainId, tx);
        return {
            estimateGas: estimateGasNormal,
            data: '',
        };
    }
};

/**
 * getNonce
 *
 * @param {NonceParams} params
 * @param {string} address - Account
 * @param {Web3} connector - web3 connector
 *
 * @returns {Promise<string>} Gas limit estimate cost
 */
export const getNonce = async ({
    address,
    connector,
}: NonceParams): Promise<string> => {
    return (
        '0x' +
        (await connector.eth.getTransactionCount(address, 'pending')).toString(
            16,
        )
    );
};
