import { VersionedTransaction } from '@solana/web3.js';
import { EstimateFeeParams } from './types';
import { EstimateFeeResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { estimateFeeParametersChecker } from '../parametersChecker';
/* 
rawTransaction
    Returns raw transaction
    @param transaction: Transaction web3 solana VersionedTransaction | Transaction 
    @param connector: solana web3 connector
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
