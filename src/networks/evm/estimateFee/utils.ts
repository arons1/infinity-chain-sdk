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

import { Chains, TransactionEVM } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/evm';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { isValidNumber } from '@infinity/core-sdk/lib/commonjs/utils';
import Web3 from 'web3';
/* 
calculateGasPrice
    Format gas price based on the current transaction
    @param connector: web3 connector
    @param chainId: chainId
    @param transaction: TransactionEVM
    @param gasPrice: gas price
    @param feeRatio: number fee ratio
    @param priorityFee: priority fee number
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
            '0x' + new BigNumber(transaction.value as string).toString(16);
    return transaction;
};
/* 
getGasPrice
    Returns gas price
    @param web3: web3 connector
*/
export const getGasPrice = async ({
    connector,
}: GasPriceParams): Promise<string> => {
    return '0x' + (await connector.eth.getGasPrice()).toString(16);
};
/* 
estimateGas
    Returns gas limit estimate cost
    @param connector: web3 connector
    @param chainId: chainId
    @param tx: TransactionEVM
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
/* 
getGasLimit
    Returns gas limit estimate cost
    @param value: Amount to bridge in wei
    @param connector: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param tokenContract: token contract
    @param contract: Web3 contract
    @param isToken: If it's a token transfer
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
/* 
getNonce
    Returns gas limit estimate cost
    @param address: Account
    @param web3: web3 connector
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
