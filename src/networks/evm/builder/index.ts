import { TransactionEVM } from '@infinity/core-sdk/lib/commonjs/networks/evm';

import { BuildTransaction } from './types';
import { estimateFee } from '../estimateFee';

/* 
buildTransaction
    Returns a transaction formatted to be sign and send
    @param value: ammount to send (optional)
    @param source: source account
    @param destination: destination account
    @param data: data of the transaction (optional)
    @param chainId: The ID of the chain
    @param feeRatio: Between 0 and 1, default 0.5, its the range to increase or decrease de fee, 0.5 = use default gasPrice (optional)
    @param priorityFee: Just for chainId, 1 or 137, it's used for calculating the fee
    @param gasPrice: It's the gas price to use (optional). Place it just when you require a fixed gasPrice.
*/
export const buildTransaction = async (
    props: BuildTransaction,
): Promise<TransactionEVM | undefined> => {
    const gaslimit = await estimateFee(props);
    return gaslimit.transaction;
};

export * from './tokens';
export * from './types';
