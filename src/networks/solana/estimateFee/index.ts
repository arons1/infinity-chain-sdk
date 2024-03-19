import { VersionedTransaction } from '@solana/web3.js';
import { EstimateFeeParams } from './types';

export const estimateFee = async ({
    web3,
    transaction,
}: EstimateFeeParams): Promise<number | string | null> => {
    if ('message' in transaction)
        return (
            await web3.getFeeForMessage(
                (transaction as VersionedTransaction).message,
                'confirmed',
            )
        ).value;
    else return await transaction.getEstimatedFee(web3);
};
