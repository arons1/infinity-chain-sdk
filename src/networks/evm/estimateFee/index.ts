import {
    EstimateGasBridgeParams,
    EstimateGasParams,
    GasLimitParams,
    NonceParams,
    GasPriceParams,
    EstimateGasTokenParams,
    CalculateGasPrice,
    ReturnEstimate,
} from './types';
// @ts-ignore
import ERC20Abi from '../../../core/abi/erc20';
import { getDataBSC, getGasLimitBSC } from './sendBridge';
import { tokenHubContractAddress } from './abi_bsc';
import { TransactionEVM } from '../general/types';
import BigNumber from 'bignumber.js';
import {
    CannotGetNonce,
    InvalidAddress,
    InvalidAmount,
    InvalidChainError,
    InvalidContractAddress,
    InvalidTokenContract,
    PriorityFeeError,
} from '../../../errors/networks';
import { isValidNumber } from '../../../utils';
import { SupportedChains } from '../general/contants';
import { isValidAddress } from '../sdk/ethereumjs-util/account';
/* 
estimateBridgeFee
    Returns BSC bridge to BC estimate cost
    @param amount: Amount to bridge in wei
    @param web3: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive (BC)
    @param chainId: chainId (56 or 97)
    @param feeRatio: ratio (between 0 and 1) to increase de fee
*/
const estimateBridgeFee = async ({
    amount = '0',
    web3,
    source,
    destination = '',
    chainId,
    feeRatio,
}: EstimateGasBridgeParams): Promise<ReturnEstimate> => {
    var contract = new web3.eth.Contract(ERC20Abi, tokenHubContractAddress, {
        from: source,
    });
    const { estimateGas, data } = await getGasLimit({
        source,
        destination,
        tokenContract: tokenHubContractAddress,
        amount,
        contract,
        web3,
        isToken: true,
    });
    var gasPrice = await getGasPrice({
        web3,
    });
    const nonce = await getNonce({
        address: source,
        web3,
    });
    var transaction = {
        from: source,
        nonce: nonce,
        to: tokenHubContractAddress,
        value: amount,
        data,
    } as TransactionEVM;
    transaction = await calculateGasPrice({
        transaction,
        gasPrice,
        web3,
        chainId,
        feeRatio,
    });
    return {
        estimateGas,
        gasPrice: transaction.gasPrice ?? transaction.maxFeePerGas,
        transaction,
    };
};
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
    chainId,
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
    const nonce = await getNonce({
        address: source,
        web3,
    });
    var transaction = {
        from: source,
        nonce: nonce,
        to: tokenContract,
        data,
        value: amount,
    } as TransactionEVM;
    transaction = await calculateGasPrice({
        transaction,
        gasPrice,
        web3,
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
estimateCurrencyFee
    Returns currency transfer estimate cost
    @param amount: Amount to bridge in wei
    @param web3: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
*/
const estimateCurrencyFee = async ({
    amount = '0',
    web3,
    source,
    destination = '',
    chainId,
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
    const nonce = await getNonce({
        address: source,
        web3,
    });
    var transaction = {
        from: source,
        nonce: nonce,
        to: destination,
        value: amount,
    } as TransactionEVM;
    transaction = await calculateGasPrice({
        transaction,
        gasPrice,
        web3,
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
    const isBridge = destination.startsWith('bnb');
    if (isBridge) {
        const data = getDataBSC({
            toAddress: destination,
            amount,
            web3,
        });
        const estimateGas = await getGasLimitBSC({
            fromAddress: source,
            toAddress: destination,
            amount,
            web3,
        });
        return {
            data,
            estimateGas,
        };
    } else {
        if (!isValidAddress(destination)) throw new Error(InvalidAddress);
        if (isToken) {
            if (!isValidAddress(tokenContract as string))
                throw new Error(InvalidContractAddress);
            if (!contract) throw new Error(InvalidTokenContract);
            const nonce = await getNonce({ address: source, web3 });
            if (!nonce) throw new Error(CannotGetNonce);
            const data = contract.methods
                .transfer(destination, amount)
                .encodeABI();
            const estimateGas = await web3.eth.estimateGas({
                from: source,
                nonce: nonce,
                to: tokenContract,
                data,
                value: amount,
            });
            return {
                data,
                estimateGas,
            };
        } else {
            const nonce = await getNonce({ address: source, web3 });
            if (nonce == undefined) throw new Error(CannotGetNonce);
            const estimateGas = await web3.eth.estimateGas({
                from: source,
                nonce: nonce,
                to: destination,
                value: amount,
            });
            return {
                estimateGas,
                data: '',
            };
        }
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
    return await web3.eth.getTransactionCount(address, 'pending');
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
    chainId,
    feeRatio = 0.5,
    priorityFee,
}: EstimateGasParams): Promise<ReturnEstimate> => {
    const isBridge = destination.startsWith('bnb');
    if (!isValidAddress(source)) throw new Error(InvalidAddress);
    if (!SupportedChains.includes(chainId)) throw new Error(InvalidChainError);
    if (isBridge) {
        if (chainId != 56 && chainId != 96) throw new Error(InvalidChainError);
        return await estimateBridgeFee({
            amount,
            web3,
            source,
            destination,
            feeRatio,
            chainId,
        });
    } else {
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
                chainId,
                feeRatio,
                priorityFee,
            });
        } else {
            return await estimateCurrencyFee({
                web3,
                source,
                destination,
                amount,
                chainId,
                feeRatio,
                priorityFee,
            });
        }
    }
};
