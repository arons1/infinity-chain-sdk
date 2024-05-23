import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { EstimateFeeParams, EstimateOperation } from './types';
import { DEFAULT_FEE } from '@taquito/taquito';
import { formatOpParamsBeforeSend, hasManager } from '../utils';
import { buildOperation, buildTransfer } from '../builder';
import { EstimateFeeResult } from '../../types';
import { TezosToolkit } from '@taquito/taquito';
import { RpcForger, CompositeForger } from '@taquito/taquito';
import {
    ReadOnlySigner,
    michelEncoder,
    readOnlySigner,
} from '../getBalance/tez';
import { localForger } from '@taquito/local-forging';
import {
    CannotEstimateTransaction,
    CannotGetAccount,
} from '../../../errors/networks';

const ADDITIONAL_FEE = 100;

export const getAditionalFee = (fee: number) => {
    const nm = new BigNumber(ADDITIONAL_FEE + ADDITIONAL_FEE * fee).toString(
        10,
    );
    return new BigNumber(nm.split('.')[0]);
};
export const feeReveal = async (account: string, connector: TezosToolkit) => {
    try {
        const manager = await connector.rpc.getManagerKey(account);
        if (!hasManager(manager)) {
            return DEFAULT_FEE.REVEAL;
        }
        return 0;
    } catch (e) {
        console.log(e);
        throw new Error(CannotGetAccount);
    }
};
/**
 * Returns estimate fee
 * @param {object} params
 * @param {string} params.value - amount to transfer
 * @param {string} params.source - source account
 * @param {string} params.destination - destination account
 * @param {number} [params.idToken=0] - Id of the token
 * @param {string} [params.mintToken] - Mint of the token to transfer
 * @param {TezosToolkit} params.connector - Tezos api connector
 * @param {string} params.pkHash - Public hash of source account
 * @param {number} [params.decimalsToken=0] - Decimals of the token to transfer
 * @param {number} [params.feeRatio=0.5] - Ratio of fee
 * @returns {Promise<EstimateFeeResult>}
 */
export const estimateFee = async ({
    value,
    source,
    destination,
    idToken = 0,
    mintToken,
    connector,
    pkHash,
    decimalsToken,
    feeRatio = 0.5,
}: EstimateFeeParams): Promise<EstimateFeeResult> => {
    connector.setSignerProvider(readOnlySigner);
    if (mintToken && decimalsToken) {
        const operationResult = await buildOperation({
            source,
            pkHash,
            destination,
            value,
            mintToken,
            idToken,
            decimalsToken,
            connector,
        });
        return {
            fee: new BigNumber(operationResult.fee)
                .plus(await feeReveal(source, connector))
                .toString(10),
        };
    } else {
        const fee = await buildTransfer({
            connector,
            pkHash,
            source,
            value,
            destination,
            feeRatio,
        });
        return {
            fee: new BigNumber(fee)
                .plus(await feeReveal(source, connector))
                .toString(10),
        };
    }
};

/**
 * Estimates the fee for a batch of operations.
 *
 * @param {EstimateOperation} params - The parameters for estimating the fee.
 * @param {object[]} params.operations - The list of operations to estimate.
 * @param {TezosToolkit} params.connector - The Tezos toolkit connector.
 * @param {string} params.pkHash - The public hash of the source account.
 * @param {string} params.source - The source account.
 * @returns {Promise<EstimateFeeResult>} - The estimated fee.
 */
export const estimateOperation = async ({
    operations,
    connector,
    pkHash,
    source,
}: EstimateOperation): Promise<EstimateFeeResult> => {
    // Set the forger provider
    connector.setForgerProvider(
        new CompositeForger([connector.getFactory(RpcForger)(), localForger]),
    );

    // Set the packer provider
    connector.setPackerProvider(michelEncoder);

    // Set the signer provider
    connector.setSignerProvider(new ReadOnlySigner(source, pkHash));

    // Initialize the estimated base fee
    let estimatedBaseFee = new BigNumber(0);
    try {
        const transferFeesList = await connector.estimate.batch(
            operations.map(formatOpParamsBeforeSend),
        );

        // Calculate the total estimated base fee
        for (let transferFees of transferFeesList) {
            estimatedBaseFee = estimatedBaseFee.plus(
                transferFees.burnFeeMutez + transferFees.suggestedFeeMutez,
            );
        }

        // Return the estimated fee
        return { fee: estimatedBaseFee.toString(10) };
    } catch (e) {
        console.error(e);
        throw new Error(CannotEstimateTransaction);
    }
    // Estimate the fees for each operation
};
