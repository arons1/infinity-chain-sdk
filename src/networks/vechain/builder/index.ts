import { calculateGasPrice, getGasPrice } from '../estimateFee';
import { isValidAddress } from '../sdk/ethereumjs-util/account';
import { BuildTransaction } from './types';
import { InvalidAddress,TransactionEVM } from '@infinity/core-sdk';

/* 
buildTransaction
    Returns a transaction formatted to be sign and send
    @param value: ammount to send (optional)
    @param source: source account
    @param destination: destination account
    @param data: data of the transaction (optional)
    @param feeRatio: Between 0 and 1, default 0.5, its the range to increase or decrease de fee, 0.5 = use default gasPrice (optional)
    @param priorityFee: Just for chainId, 1 or 137, it's used for calculating the fee
    @param gasPrice: It's the gas price to use (optional). Place it just when you require a fixed gasPrice.
*/
export const buildTransaction = async ({
    value,
    source,
    destination,
    data,
    web3,
    feeRatio = 0.5,
    priorityFee,
    gasPrice,
}: BuildTransaction): Promise<TransactionEVM> => {
    if (!isValidAddress(source)) throw new Error(InvalidAddress);
    if (!isValidAddress(destination)) throw new Error(InvalidAddress);
    if (!gasPrice)
        gasPrice = await getGasPrice({
            web3,
        });
    var transaction = {
        from: source,
        to: destination,
        data,
        value,
    } as TransactionEVM;
    transaction = await calculateGasPrice({
        transaction,
        gasPrice,
        web3,
        feeRatio,
        priorityFee,
    });
    return transaction;
};

export * from './tokens';
export * from './types';
