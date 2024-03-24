import { InMemorySigner } from '@taquito/signer';
import {
    BuildOperationParams,
    BuildOperationResult,
    BuildOperationsParams,
    BuildTransactionParams,
    BuildTransactionResult,
    BuildTransferParams,
} from './types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { getAditionalFee } from '../estimateFee';
import { readOnlySigner } from '../getBalance/tez';
import { ContractMethod, ContractProvider } from '@taquito/taquito';

export const buildOperations = async ({
    source,
    destination,
    value,
    mintToken,
    decimalsToken,
    idToken,
    connector,
}: BuildOperationsParams) => {
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
export const buildOperation = async ({
    source,
    destination,
    value,
    mintToken,
    idToken = 0,
    connector,
    decimalsToken,
    feeRatio = 0.5,
}: BuildOperationParams): Promise<BuildOperationResult> => {
    connector.setSignerProvider(readOnlySigner);
    const operation: ContractMethod<ContractProvider> = await buildOperations({
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
export const buildTransfer = async ({
    connector,
    value,
    destination,
    feeRatio = 0.5,
}: BuildTransferParams): Promise<string> => {
    connector.setSignerProvider(readOnlySigner);
    const amount = new BigNumber(value).shiftedBy(-6).toNumber();
    const transferFees = await connector.estimate.transfer({
        to: destination,
        amount,
    });
    var estimatedBaseFeeb = new BigNumber(transferFees.suggestedFeeMutez);
    estimatedBaseFeeb = estimatedBaseFeeb.plus(getAditionalFee(feeRatio));
    return estimatedBaseFeeb.toString(10);
};
export const buildTransaction = async ({
    source,
    destination,
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
