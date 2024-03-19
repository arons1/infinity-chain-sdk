import { EstimateGasParams } from './types';
// @ts-ignore
import feeAbi from '../../../core/abi/fee';
import BigNumber from 'bignumber.js';
import {
    InvalidAddress,
    InvalidChainError,
    InvalidContractAddress,
} from '../../../errors/networks';
import { SupportedChains, isValidAddress } from '@infinity/core-sdk';
import { EstimateFeeResult } from '../../types';
import { estimateTokenFee } from './tokens';
import { estimateCurrencyFee } from './currency';
import { estimateL1Cost } from '../../op/estimateGas';

/* 
estimateFee
    Returns estimate fee transfer
    @param web3: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
    @param tokenContract: token contract
*/
export const estimateFee = async ({
    web3,
    source,
    tokenContract = '',
    destination = '',
    amount = '0',
    chainId,
    feeRatio = 0.5,
    priorityFee,
}: EstimateGasParams): Promise<EstimateFeeResult> => {
    if (!isValidAddress(source)) throw new Error(InvalidAddress);
    if (!SupportedChains.includes(chainId)) throw new Error(InvalidChainError);
    if (!isValidAddress(destination)) throw new Error(InvalidAddress);
    let resultEstimate;
    if (tokenContract.length > 0) {
        if (!isValidAddress(tokenContract))
            throw new Error(InvalidContractAddress);
        resultEstimate = await estimateTokenFee({
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
        resultEstimate = await estimateCurrencyFee({
            web3,
            source,
            destination,
            amount,
            chainId,
            feeRatio,
            priorityFee,
        });
    }

    var fee = new BigNumber(resultEstimate.estimateGas)
        .multipliedBy(resultEstimate.gasPrice as string)
        .toString(10);
    if (chainId == 10)
        fee = new BigNumber(
            await estimateL1Cost(web3, resultEstimate.transaction),
        )
            .plus(fee)
            .toString(10);
    return {
        fee,
        transaction: resultEstimate.transaction,
    };
};

export * from './currency'
export * from './tokens'
export * from './utils'
export * from './types'