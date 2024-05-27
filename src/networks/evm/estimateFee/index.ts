import { EstimateGasParams, EstimateGasTokenParams } from './types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { EstimateFeeResult } from '../../types';
import { estimateTokenFee } from './tokens';
import { estimateCurrencyFee } from './currency';
import { estimateL1Cost } from '../../op/estimateFee';
import {
    Chains,
    Transaction,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { estimateParametersChecker } from '../parametersChecker';
import { CannotEstimateTransaction } from '../../../errors/networks';

/**
 * estimateFee
 *
 * Returns estimate fee transfer
 *
 * @param {Object} props
 * @param {Web3} props.connector - Web3 connector
 * @param {string} props.source - Source account to send from
 * @param {string} props.destination - Destination account to receive
 * @param {string} props.chainId - ChainId
 * @param {number} props.feeRatio - Ratio (between 0 and 1) to increase de fee
 * @param {number} [props.priorityFee] - Account index derivation
 * @param {string} [props.tokenContract] - Token contract
 * @param {string} [props.gasPrice] - Gas Price (optional)
 * @returns {Promise<EstimateFeeResult>}
 */
export const estimateFee = async (
    props: EstimateGasParams,
): Promise<EstimateFeeResult> => {
    estimateParametersChecker(props);
    try {
        let estimateRes;
        if (props.tokenContract && props.tokenContract.length > 0) {
            estimateRes = await estimateTokenFee(
                props as EstimateGasTokenParams,
            );
        } else {
            estimateRes = await estimateCurrencyFee(props);
        }
        let fee = new BigNumber(estimateRes.estimateGas)
            .multipliedBy(estimateRes.gasPrice as string)
            .toString(10);
        if (props.chainId == Chains.OP) {
            const txBuilder = new Transaction(
                estimateRes.transaction,
            ).serialize();
            fee = new BigNumber(
                await estimateL1Cost(
                    props.connector,
                    '0x' + txBuilder.toString('hex'),
                ),
            )
                .plus(fee)
                .toString(10);
        }

        return {
            fee,
            transaction: estimateRes.transaction,
        };
    } catch (error: any) {
        console.error(error);
        throw new Error(error.code ?? CannotEstimateTransaction);
    }
};

export * from './currency';
export * from './tokens';
export * from './utils';
export * from './types';
