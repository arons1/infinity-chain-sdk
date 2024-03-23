import { EstimateGasParams } from './types';
// @ts-ignore
import feeAbi from '../../../core/abi/fee';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import {
    InvalidAddress,
    InvalidChainError,
    InvalidContractAddress,
} from '../../../errors/networks';
import { EstimateFeeResult } from '../../types';
import { estimateTokenFee } from './tokens';
import { estimateCurrencyFee } from './currency';
import { estimateL1Cost } from '../../op/estimateFee';
import {
    SupportedChains,
    isValidAddress,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';

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
    connector,
    source,
    tokenContract = '',
    destination = '',
    value = '0',
    chainId,
    gasPrice,
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
            connector,
            source,
            tokenContract,
            destination,
            gasPrice,
            value,
            chainId,
            feeRatio,
            priorityFee,
        });
    } else {
        resultEstimate = await estimateCurrencyFee({
            connector,
            source,
            destination,
            value,
            chainId,
            gasPrice,
            feeRatio,
            priorityFee,
        });
    }

    var fee = new BigNumber(resultEstimate.estimateGas)
        .multipliedBy(resultEstimate.gasPrice as string)
        .toString(10);
    if (chainId == 10)
        fee = new BigNumber(
            await estimateL1Cost(connector, resultEstimate.transaction),
        )
            .plus(fee)
            .toString(10);
    return {
        fee,
        transaction: resultEstimate.transaction,
    };
};

export * from './currency';
export * from './tokens';
export * from './utils';
export * from './types';
