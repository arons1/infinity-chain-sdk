import { VersionedTransaction } from '@solana/web3.js';
import { EstimateFeeParams } from './types';
import { EstimateFeeResult } from '../../types';
import BigNumber from 'bignumber.js';

export const estimateFee = async ({
    web3,
    transaction,
}: EstimateFeeParams): Promise<EstimateFeeResult> => {
    if ('message' in transaction)
        return {
            fee: (
                await web3.getFeeForMessage(
                    (transaction as VersionedTransaction).message,
                    'confirmed',
                )
            ).value?.toString(10),
        };
    else
        return {
            fee: new BigNumber(
                (await transaction.getEstimatedFee(web3)) as number,
            ).toString(10),
        };
};
