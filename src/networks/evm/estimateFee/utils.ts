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
    TransactionEVM,
    isValidAddress,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';

import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { isValidNumber } from '@infinity/core-sdk/lib/commonjs/utils';

export const calculateGasPrice = async ({
    transaction,
    gasPrice,
    web3,
    chainId,
    feeRatio,
    priorityFee,
}: CalculateGasPrice): Promise<TransactionEVM> => {
    if (chainId == 1 || chainId == 137) {
        if (!isValidNumber(priorityFee)) throw new Error(PriorityFeeError);
        const maxPriority = web3.utils.toHex(
            new BigNumber(priorityFee as string)
                .multipliedBy(feeRatio + 1)
                .toString(10)
                .split('.')[0],
        );
        transaction.maxPriorityFeePerGas = maxPriority;
        transaction.maxFeePerGas = new BigNumber(maxPriority)
            .plus(new BigNumber(gasPrice).multipliedBy(1 + feeRatio))
            .toString(10);
        transaction.maxFeePerGas = web3.utils.toHex(
            new BigNumber(transaction.maxFeePerGas).toString(10).split('.')[0],
        );
        delete transaction.gasPrice;
    } else {
        transaction.gasPrice = web3.utils.toHex(gasPrice);
    }
    return transaction;
};
/* 
getGasPrice
    Returns gas price
    @param web3: web3 connector
*/
export const getGasPrice = async ({
    web3,
}: GasPriceParams): Promise<string> => {
    return '0x' + (await web3.eth.getGasPrice()).toString(16);
};

/* 
getGasLimit
    Returns gas limit estimate cost
    @param value: Amount to bridge in wei
    @param web3: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
    @param tokenContract: token contract
    @param contract: Web3 contract
    @param isToken: If it's a token transfer
    @param isBridge: If it's a BSC to BC bridge
*/
export const getGasLimit = async ({
    destination,
    tokenContract,
    value,
    source,
    contract,
    chainId,
    web3,
    isToken = false,
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
        const nonce = await getNonce({ address: source, web3 });
        if (!nonce) throw new Error(CannotGetNonce);
        const data = contract.methods.transfer(destination, value).encodeABI();
        const estimateGas = await web3.eth.estimateGas({
            from: source,
            nonce: nonce,
            to: tokenContract,
            data,
            value: value,
        });
        return {
            data,
            estimateGas: estimateGas.toString(10),
        };
    } else {
        const tx: TransactionEVM = {
            from: source,
            to: destination,
            value: value,
        };
        if (chainId != 100009) {
            const nonce = await getNonce({ address: source, web3 });
            if (nonce == undefined) throw new Error(CannotGetNonce);
            tx.nonce = nonce;
        }
        const estimateGas = await web3.eth.estimateGas(tx);
        return {
            estimateGas: estimateGas.toString(10),
            data: '',
        };
    }
};
/* 
getNonce
    Returns gas limit estimate cost
    @param address: Account
    @param web3: web3 connector
*/
export const getNonce = async ({
    address,
    web3,
}: NonceParams): Promise<string> => {
    return (
        '0x' +
        (await web3.eth.getTransactionCount(address, 'pending')).toString(16)
    );
};
