import { InMemorySigner } from '@taquito/signer';
import {
    BuildOperationParams,
    BuildOperationResult,
    BuildOperationsParams,
    BuildTransactionParams,
    BuildTransactionResult,
    BuildTransferOperationResult,
    BuildTransferOperationsParams,
    BuildTransferParams,
} from './types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { estimateOperation, getAditionalFee } from '../estimateFee';
import { ReadOnlySigner, readOnlySigner } from '../getBalance/tez';
import { ContractMethod, ContractProvider } from '@taquito/taquito';
import { formatOpParamsBeforeSend } from '../utils';

const buildTransferOperations = async ({
    source,
    destination,
    value,
    mintToken,
    decimalsToken,
    idToken,
    connector,
}: BuildTransferOperationsParams) => {
    const contract = await connector.contract.at(mintToken);
    var isFA2 = contract.entrypoints?.entrypoints?.transfer?.prim == 'list';
    if (isFA2) {
        return contract.methods.transfer([
            {
                from_: source,
                txs: [
                    {
                        to_: destination,
                        token_id: idToken ?? 0,
                        amount: new BigNumber(value)
                            .shiftedBy(decimalsToken * -1)
                            .toNumber(),
                    },
                ],
            },
        ]);
    } else {
        return contract.methods.transfer(source, destination, value);
    }
};
/*
buildOperations
    Returns prepared transaction of operation
    @param source: source account
    @param destination: destination account
    @param pkHash: public hash of source account
    @param value: value to send
    @param mintToken: mint of the token to transfer(optional)
    @param idToken: Id of the token(optional)
    @param connector: Tezos api connector
    @param decimalsToken: Decimals of the token to transfer(optional)
    @param feeRatio: Ratio of fee
*/
export const buildOperation = async ({
    source,
    destination,
    pkHash,
    value,
    mintToken,
    idToken = 0,
    connector,
    decimalsToken,
    feeRatio = 0.5,
}: BuildOperationParams): Promise<BuildTransferOperationResult> => {
    connector.setSignerProvider(new ReadOnlySigner(source, pkHash));
    const operation: ContractMethod<ContractProvider> =
        await buildTransferOperations({
            source,
            destination,
            value,
            mintToken,
            idToken,
            decimalsToken,
            connector,
        });
    const transferFees = await connector.estimate.transfer(
        operation.toTransferParams(),
    );
    var estimatedBaseFee = new BigNumber(transferFees.suggestedFeeMutez);
    estimatedBaseFee = estimatedBaseFee.plus(getAditionalFee(feeRatio));
    return {
        operation,
        fee: estimatedBaseFee.toString(10),
    };
};
const buildTransfer = async ({
    connector,
    value,
    source,
    pkHash,
    destination,
    feeRatio = 0.5,
}: BuildTransferParams): Promise<string> => {
    connector.setSignerProvider(new ReadOnlySigner(source, pkHash));
    const amount = new BigNumber(value).shiftedBy(-6).toNumber();
    const transferFees = await connector.estimate.transfer({
        to: destination,
        amount,
    });
    var estimatedBaseFeeb = new BigNumber(transferFees.suggestedFeeMutez);
    estimatedBaseFeeb = estimatedBaseFeeb.plus(getAditionalFee(feeRatio));
    return estimatedBaseFeeb.toString(10);
};
/*
buildOperations
    Returns prepared transaction of operations
    @param source: source account
    @param destination: destination account
    @param pkHash: public hash of source account
    @param value: value to send
    @param mintToken: mint of the token to transfer(optional)
    @param idToken: Id of the token(optional)
    @param privateKey: Private key of the account
    @param connector: Tezos api connector
    @param decimalsToken: Decimals of the token to transfer(optional)
    @param feeRatio: Ratio of fee
*/
export const buildTransaction = async ({
    source,
    destination,
    pkHash,
    value,
    mintToken,
    idToken = 0,
    privateKey,
    connector,
    decimalsToken,
    feeRatio = 0.5,
}: BuildTransactionParams): Promise<BuildTransactionResult> => {
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
            broadcast: () =>
                operationResult.operation.send({
                    fee: new BigNumber(operationResult.fee).toNumber(),
                }),
            fee: operationResult.fee,
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
            broadcast: async () => {
                connector.setSignerProvider(
                    await InMemorySigner.fromSecretKey(privateKey),
                );
                const amount = new BigNumber(value).shiftedBy(-6).toNumber();
                return connector.contract.transfer({
                    to: destination,
                    amount,
                    fee: new BigNumber(fee).toNumber(),
                });
            },
            fee,
        };
    }
};
/*
buildOperations
    Returns prepared transaction of operations
    @param operations: Operations to build
    @param privateKey: Buffer private key
    @param connector: Tezos api connector
    @param pkHash: public key hash
    @param source: public address
*/
export const buildOperations = async ({
    operations,
    connector,
    privateKey,
    pkHash,
    source,
}: BuildOperationsParams): Promise<BuildOperationResult> => {
    const batch = await connector.contract.batch(
        operations.map(formatOpParamsBeforeSend),
    );
    const fee = await estimateOperation({
        operations,
        connector,
        pkHash,
        source,
    });
    return {
        broadcast: async () => {
            connector.setSignerProvider(
                await InMemorySigner.fromSecretKey(privateKey),
            );
            return batch.send();
        },
        fee: fee?.fee as string,
    };
};
