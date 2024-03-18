import {
    EstimateGasParams,
    GasLimitParams,
    GasPriceParams,
    EstimateGasTokenParams,
    CalculateGasPrice,
    ReturnEstimate,
} from './types';
// @ts-ignore
import ERC20Abi from '../../../core/abi/erc20';
import { TransactionEVM } from '../general/types';
import {
    InvalidAmount,
    InvalidContractAddress,
    InvalidTokenContract,
} from '../../../errors/networks';
import { InvalidAddress } from '@infinity/core-sdk';
import { isValidNumber } from '../../../utils';
import { isValidAddress } from '../sdk/ethereumjs-util/account';

/* 
estimateTokenFee
    Returns token transfer estimate cost
    @param amount: Amount to bridge in wei
    @param web3: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
    @param tokenContract: token contract
*/
const estimateTokenFee = async ({
    amount = '0',
    web3,
    source,
    destination,
    tokenContract,
    feeRatio = 0.5,
    priorityFee,
}: EstimateGasTokenParams): Promise<ReturnEstimate> => {
    var contract = new web3.eth.Contract(ERC20Abi, tokenContract, {
        from: source,
    });
    const { estimateGas, data } = await getGasLimit({
        source,
        destination,
        tokenContract,
        amount,
        contract,
        web3,
        isToken: true,
    });
    var gasPrice = await getGasPrice({
        web3,
    });
    var transaction = {
        from: source,
        to: tokenContract,
        data,
        value: amount,
    } as TransactionEVM;
    transaction = await calculateGasPrice({
        transaction,
        gasPrice,
        web3,
        feeRatio,
        priorityFee,
    });
    return {
        estimateGas,
        gasPrice: transaction.gasPrice ?? transaction.maxFeePerGas,
        transaction,
    };
};

export const calculateGasPrice = async ({
    transaction,
    gasPrice,
    web3
}: CalculateGasPrice): Promise<TransactionEVM> => {
    transaction.gasPrice = web3.utils.toHex(gasPrice);
    return transaction;
};
/* 
estimateCurrencyFee
    Returns currency transfer estimate cost
    @param amount: Amount to bridge in wei
    @param web3: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
*/
const estimateCurrencyFee = async ({
    amount = '0',
    web3,
    source,
    destination = '',
    feeRatio,
    priorityFee,
}: EstimateGasParams): Promise<ReturnEstimate> => {
    const { estimateGas } = await getGasLimit({
        source,
        destination,
        amount,
        web3,
        isToken: false,
    });
    var gasPrice = await getGasPrice({ web3 });
    var transaction = {
        from: source,
        to: destination,
        value: amount,
    } as TransactionEVM;
    transaction = await calculateGasPrice({
        transaction,
        gasPrice,
        web3,
        feeRatio,
        priorityFee,
    });
    return {
        estimateGas,
        gasPrice,
        transaction,
    };
};
/* 
getGasPrice
    Returns gas price
    @param web3: web3 connector
*/
export const getGasPrice = async ({
    web3,
}: GasPriceParams): Promise<string> => {
    return await web3.eth.getGasPrice();
};
/* 
getGasLimit
    Returns gas limit estimate cost
    @param amount: Amount to bridge in wei
    @param web3: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
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
    amount,
    source,
    contract,
    web3,
    isToken = false,
}: GasLimitParams): Promise<{
    data: string;
    estimateGas: string;
}> => {
    if (!isValidAddress(source)) throw new Error(InvalidAddress);
    if (!isValidNumber(amount)) throw new Error(InvalidAmount);
    if (!isValidAddress(destination)) throw new Error(InvalidAddress);
    if (isToken) {
        if (!isValidAddress(tokenContract as string))
            throw new Error(InvalidContractAddress);
        if (!contract) throw new Error(InvalidTokenContract);
        const data = contract.methods
            .transfer(destination, amount)
            .encodeABI();
        const estimateGas = await web3.eth.estimateGas({
            from: source,
            to: tokenContract,
            data,
            value: amount,
        });
        return {
            data,
            estimateGas,
        };
    } else {
        const estimateGas = await web3.eth.estimateGas({
            from: source,
            to: destination,
            value: amount,
        });
        return {
            estimateGas,
            data: '',
        };
    }

};

/* 
estimateFeeTransfer
    Returns estimate fee transfer
    @param web3: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
    @param tokenContract: token contract
*/
export const estimateFeeTransfer = async ({
    web3,
    source,
    tokenContract = '',
    destination = '',
    amount = '0',
    feeRatio = 0.5,
    priorityFee,
}: EstimateGasParams): Promise<ReturnEstimate> => {
    if (!isValidAddress(destination)) throw new Error(InvalidAddress);
    if (tokenContract.length > 0) {
        if (!isValidAddress(tokenContract))
            throw new Error(InvalidContractAddress);
        return await estimateTokenFee({
            web3,
            source,
            tokenContract,
            destination,
            amount,
            feeRatio,
            priorityFee,
        });
    } else {
        return await estimateCurrencyFee({
            web3,
            source,
            destination,
            amount,
            feeRatio,
            priorityFee,
        });
    }

};
