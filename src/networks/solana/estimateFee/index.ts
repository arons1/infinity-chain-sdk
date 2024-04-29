import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import { EstimateFeeParams } from './types';
import { EstimateFeeResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { estimateFeeParametersChecker } from '../parametersChecker';
import { rawTransaction } from '../builder';
import { getBalance } from '../getBalance';
import { getBalanceAfter } from '../getBalanceAfter';


/**
 * Estimates the fee for a transaction on the Solana blockchain.
 *
 * @param {EstimateFeeParams} props - The parameters for estimating the fee.
 * @param {Connection} props.connector - The Solana web3 connector.
 * @param {PublicKey} props.publicKey - The public key of the sender.
 * @param {PublicKey} props.destination - The public key of the receiver.
 * @param {boolean} [props.mintToken] - Whether or not a new token is being minted.
 * @param {string} [props.memo] - The memo to add to the transaction.
 * @param {boolean} [props.decimalsToken] - The decimals of the token.
 * @param {string} props.value - The value of the transaction.
 * @return {Promise<EstimateFeeResult>} - A promise that resolves to the estimated fee result.
 */
export const estimateFee = async (
    props: EstimateFeeParams,
): Promise<EstimateFeeResult> => {
    estimateFeeParametersChecker(props);
    const transaction = await rawTransaction(props);
    const currentBalance = await getBalance({
        connector: props.connector,
        address: props.publicKey.toString()
    })
    const balanceAfter = await getBalanceAfter({
        connector: props.connector,
        transaction,
        signer: props.publicKey.toString()
    })
    const finalFee = new BigNumber(currentBalance.balance).minus(props.mintToken ? 0 : props.value).minus(balanceAfter[props.publicKey.toString()].amount);
    return {
        fee: finalFee.toString(10),
    }
};


/**
 * Estimates the transaction cost for a given Solana transaction.
 *
 * @param {EstimateFeeResult} props - The properties object.
 * @param {VersionedTransaction | Transaction} props.transaction - The transaction object (VersionedTransaction or Transaction).
 * @param {Connection} props.connector - The Solana web3 connector.
 * @return {Promise<EstimateFeeResult>} - A promise that resolves to an object containing the estimated fee.
 */
export const estimateTransactionCost = async (props:{
    transaction: VersionedTransaction | Transaction,
    connector: Connection
}): Promise<EstimateFeeResult> => {
    if ('message' in props.transaction)
        return {
            fee: (
                await props.connector.getFeeForMessage(
                    props.transaction.message,
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
}