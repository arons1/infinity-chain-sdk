import { VersionedTransaction } from '@solana/web3.js';
import { EstimateFeeParams } from './types';
import { EstimateFeeResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { estimateFeeParametersChecker } from '../parametersChecker';

/**
 * Estimates fee for Solana transaction
 * @param {VersionedTransaction | Transaction} props.transaction Transaction object (VersionedTransaction or Transaction)
 * @param {Connection} props.connector solana web3 connector
 * @returns {Promise<EstimateFeeResult>} raw transaction
 */
export const estimateFee = async (
    props: EstimateFeeParams,
): Promise<EstimateFeeResult> => {
    estimateFeeParametersChecker(props);
    if ('message' in props.transaction)
        return {
            fee: (
                await props.connector.getFeeForMessage(
                    (props.transaction as VersionedTransaction).message,
                    'confirmed',
                )
            ).value?.toString(10),
        };
    else
        return {
            fee: new BigNumber(
                (await props.transaction.getEstimatedFee(
                    props.connector,
                )) as number,
            ).toString(10),
        };
};
