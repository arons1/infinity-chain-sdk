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

const ADDITIONAL_FEE = 100;

export const getAditionalFee = (fee: number) => {
    const nm = new BigNumber(ADDITIONAL_FEE + ADDITIONAL_FEE * fee).toString(
        10,
    );
    return new BigNumber(nm.split('.')[0]);
};
export const feeReveal = async (account: string, connector: TezosToolkit) => {
    const manager = await connector.rpc.getManagerKey(account);
    if (!hasManager(manager)) {
        return DEFAULT_FEE.REVEAL;
    }
    return 0;
};
/*
estimateFee
    Returns estimate fee
    @param value: amount to transfer
    @param source: source account
    @param destination: destination account
    @param idToken: Id of the token(optional)
    @param mintToken: mint of the token to transfer(optional)
    @param connector: Tezos api connector
    @param pkHash: public hash of source account
    @param decimalsToken: Decimals of the token to transfer(optional)
    @param feeRatio: Ratio of fee
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

export const estimateOperation = async ({
    operations,
    connector,
    pkHash,
    source,
}: EstimateOperation): Promise<EstimateFeeResult> => {
    connector.setForgerProvider(
        new CompositeForger([connector.getFactory(RpcForger)(), localForger]),
    );
    connector.setPackerProvider(michelEncoder);
    connector.setSignerProvider(new ReadOnlySigner(source, pkHash));
    var estimatedBaseFee = new BigNumber(0);
    const transferFeesList = await connector.estimate.batch(
        operations.map(formatOpParamsBeforeSend),
    );
    for (let transferFees of transferFeesList) {
        estimatedBaseFee = estimatedBaseFee.plus(
            transferFees.burnFeeMutez + transferFees.suggestedFeeMutez,
        );
    }
    return { fee: estimatedBaseFee.toString(10) };
};
