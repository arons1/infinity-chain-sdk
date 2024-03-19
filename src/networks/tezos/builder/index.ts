import { InMemorySigner } from '@taquito/signer';
import { BuildOperationsParams, BuildTransactionParams } from './types';
import BigNumber from 'bignumber.js';
import { getAditionalFee } from '../estimateFee';

export const buildOperations = async ({
    source,
    destination,
    value,
    mintToken,
    idToken,
    web3,
}: BuildOperationsParams) => {
    const contract = await web3.contract.at(mintToken);
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
    web3,
    feeRatio = 0.5,
}: BuildTransactionParams) => {
    web3.setSignerProvider(await InMemorySigner.fromSecretKey(privateKey));
    if (mintToken) {
        const operation = await buildOperations({
            source,
            destination,
            value,
            mintToken,
            idToken,
            web3,
        });
        const transferFees = await web3.estimate.transfer(
            operation.toTransferParams(),
        );
        var estimatedBaseFee = new BigNumber(transferFees.suggestedFeeMutez);
        estimatedBaseFee = estimatedBaseFee.plus(getAditionalFee(feeRatio));
        return () => operation.send({ fee: estimatedBaseFee.toNumber() });
    } else {
        const transferFees = await web3.estimate.transfer({
            to: destination,
            amount: value,
        });
        var estimatedBaseFee = new BigNumber(transferFees.suggestedFeeMutez);
        estimatedBaseFee = estimatedBaseFee.plus(getAditionalFee(feeRatio));
        return () =>
            web3.contract.transfer({
                to: destination,
                amount: value,
                fee: estimatedBaseFee.toNumber(),
            });
    }
};
