import { InMemorySigner } from '@taquito/signer';
import { BuildOperationsParams, BuildTransactionParams } from './types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { getAditionalFee } from '../estimateFee';

export const buildOperations = async ({
    source,
    destination,
    value,
    mintToken,
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
                        amount: value,
                    },
                ],
            },
        ]);
    } else {
        return contract.methods.transfer(source, destination, value);
    }
};
export const buildTransaction = async ({
    source,
    destination,
    value,
    mintToken,
    idToken = 0,
    privateKey,
    connector,
    feeRatio = 0.5,
}: BuildTransactionParams) => {
    connector.setSignerProvider(await InMemorySigner.fromSecretKey(privateKey));
    if (mintToken) {
        const operation = await buildOperations({
            source,
            destination,
            value,
            mintToken,
            idToken,
            connector,
        });
        const transferFees = await connector.estimate.transfer(
            operation.toTransferParams(),
        );
        var estimatedBaseFee = new BigNumber(transferFees.suggestedFeeMutez);
        estimatedBaseFee = estimatedBaseFee.plus(getAditionalFee(feeRatio));
        return () => operation.send({ fee: estimatedBaseFee.toNumber() });
    } else {
        const amount = new BigNumber(value).toNumber();
        const transferFees = await connector.estimate.transfer({
            to: destination,
            amount,
        });
        var estimatedBaseFeeb = new BigNumber(transferFees.suggestedFeeMutez);
        estimatedBaseFeeb = estimatedBaseFeeb.plus(getAditionalFee(feeRatio));
        return () =>
            connector.contract.transfer({
                to: destination,
                amount,
                fee: estimatedBaseFeeb.toNumber(),
            });
    }
};
