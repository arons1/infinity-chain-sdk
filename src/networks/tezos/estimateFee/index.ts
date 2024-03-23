import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { EstimateFeeParams } from './types';
import { DEFAULT_FEE } from '@taquito/taquito';
import { hasManager } from '../utils';
import { buildOperations } from '../builder';
import { EstimateFeeResult } from '../../types';
import { TezosToolkit } from '@taquito/taquito';

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
export const estimateFee = async ({
    amount,
    from,
    to,
    idToken = 0,
    mintToken,
    connector,
    feeRatio,
}: EstimateFeeParams): Promise<EstimateFeeResult> => {
    let transferFees;
    if (mintToken) {
        const operation = await buildOperations({
            source: from,
            destination: to,
            value: amount,
            mintToken,
            idToken,
            connector,
        });
        transferFees = await connector.estimate.transfer(
            operation.toTransferParams(),
        );
    } else {
        transferFees = await connector.estimate.transfer({
            to,
            amount: new BigNumber(amount).toNumber(),
        });
    }
    var estimatedBaseFee = new BigNumber(
        transferFees.burnFeeMutez + transferFees.suggestedFeeMutez,
    );
    estimatedBaseFee = estimatedBaseFee.plus(getAditionalFee(feeRatio));
    return {
        fee: estimatedBaseFee
            .plus(await feeReveal(from, connector))
            .toString(10),
    };
};
