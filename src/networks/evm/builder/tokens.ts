import {
    CannotGetNonce,
    InvalidAddress,
    InvalidChainError,
    MissingPriorityFee,
} from '../../../errors/networks';

import { BuildTokenTransaction, DataTransferType } from './types';
import { calculateGasPrice, getGasPrice, getNonce } from '../estimateFee/utils';
import {
    SupportedChains,
    TransactionEVM,
    isValidAddress,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';
import ERC20Abi from '@infinity/core-sdk/lib/commonjs/core/abi/erc20';
/* 
buildTokenTransaction
    Returns a transfer token transaction formatted to be sign and send
    @param value: ammount to send (optional)
    @param source: source account
    @param destination: destination account
    @param tokenContract: token contract
    @param chainId: The ID of the chain
    @param feeRatio: Between 0 and 1, default 0.5, its the range to increase or decrease de fee, 0.5 = use default gasPrice (optional)
    @param priorityFee: Just for chainId, 1 or 137, it's used for calculating the fee
    @param gasPrice: It's the gas price to use (optional). Place it just when you require a fixed gasPrice.
*/
export const buildTokenTransaction = async ({
    value,
    source,
    destination,
    connector,
    chainId,
    feeRatio = 0.5,
    priorityFee,
    gasPrice,
    tokenContract,
}: BuildTokenTransaction): Promise<TransactionEVM> => {
    if (!isValidAddress(source)) throw new Error(InvalidAddress);
    if (!SupportedChains.includes(chainId)) throw new Error(InvalidChainError);
    if (!isValidAddress(destination)) throw new Error(InvalidAddress);
    if (!isValidAddress(tokenContract)) throw new Error(InvalidAddress);
    if (!priorityFee && (chainId == 1 || chainId == 137))
        throw new Error(MissingPriorityFee);
    if (!gasPrice)
        gasPrice = await getGasPrice({
            connector,
        });

    const data = await getDataTransfer({
        source,
        destination,
        value,
        tokenContract,
        connector,
    });
    var transaction = {
        from: source,
        to: tokenContract,
        data,
    } as TransactionEVM;
    if (chainId != 100009) {
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
    return transaction;
};

const getDataTransfer = ({
    source,
    destination,
    value,
    tokenContract,
    connector,
}: DataTransferType) => {
    var contract = new web3.eth.Contract(ERC20Abi, tokenContract, {
        from: source,
    });
    return contract.methods.transfer(destination, value).encodeABI();
};

const getDataApprove = ({
    source,
    destination,
    value,
    tokenContract,
    connector,
}: DataTransferType) => {
    var contract = new web3.eth.Contract(ERC20Abi, tokenContract, {
        from: source,
    });
    return contract.methods.approve(destination, value).encodeABI();
};
/* 
buildTokenApproveTransaction
    Returns a approve transaction formatted to be sign and send
    @param value: ammount to send (optional)
    @param source: source account
    @param destination: destination account
    @param tokenContract: token contract
    @param chainId: The ID of the chain
    @param feeRatio: Between 0 and 1, default 0.5, its the range to increase or decrease de fee, 0.5 = use default gasPrice (optional)
    @param priorityFee: Just for chainId, 1 or 137, it's used for calculating the fee
    @param gasPrice: It's the gas price to use (optional). Place it just when you require a fixed gasPrice.
*/
export const buildTokenApproveTransaction = async ({
    value,
    source,
    destination,
    connector,
    chainId,
    feeRatio = 0.5,
    priorityFee,
    gasPrice,
    tokenContract,
}: BuildTokenTransaction): Promise<TransactionEVM> => {
    if (!isValidAddress(source)) throw new Error(InvalidAddress);
    if (!SupportedChains.includes(chainId)) throw new Error(InvalidChainError);
    if (!isValidAddress(destination)) throw new Error(InvalidAddress);
    if (!isValidAddress(tokenContract)) throw new Error(InvalidAddress);
    if (!gasPrice)
        gasPrice = await getGasPrice({
            connector,
        });

    const data = await getDataApprove({
        source,
        destination,
        value,
        tokenContract,
        connector,
    });
    var transaction = {
        from: source,
        to: tokenContract,
        data,
    } as TransactionEVM;
    if (chainId != 100009) {
        transaction.nonce = await getNonce({
            address: source,
            connector,
        });
    }
    transaction = await calculateGasPrice({
        transaction,
        gasPrice,
        connector,
        chainId,
        feeRatio,
        priorityFee,
    });
    return transaction;
};
