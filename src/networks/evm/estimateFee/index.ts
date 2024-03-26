import { EstimateGasParams, EstimateGasTokenParams } from './types';
// @ts-ignore
import feeAbi from '../../../core/abi/fee';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { EstimateFeeResult } from '../../types';
import { estimateTokenFee } from './tokens';
import { estimateCurrencyFee } from './currency';
import { estimateL1Cost } from '../../op/estimateFee';
import { Transaction } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { estimateParametersChecker } from '../parametersChecker';

/* 
estimateFee
    Returns estimate fee transfer
    @param connector: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
    @param tokenContract: token contract
    @param gasPrice: Gas Price (optional)
*/
export const estimateFee = async (
    props: EstimateGasParams,
): Promise<EstimateFeeResult> => {
    estimateParametersChecker(props);
    let resultEstimate;
    if (props.tokenContract && props.tokenContract.length > 0) {
        resultEstimate = await estimateTokenFee(
            props as EstimateGasTokenParams,
        );
    } else {
        resultEstimate = await estimateCurrencyFee(props);
    }
    var fee = new BigNumber(resultEstimate.estimateGas)
        .multipliedBy(resultEstimate.gasPrice as string)
        .toString(10);
    if (props.chainId == 10) {
        const txBuilder = new Transaction(
            resultEstimate.transaction,
        ).serialize();
        fee = new BigNumber(
            await estimateL1Cost(props.connector, txBuilder.toString('hex')),
        )
            .plus(fee)
            .toString(10);
    }

    return {
        fee,
        transaction: resultEstimate.transaction,
    };
};

export * from './currency';
export * from './tokens';
export * from './utils';
export * from './types';
