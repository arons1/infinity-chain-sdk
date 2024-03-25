import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { EstimateFeeParams } from './types';
import { DEFAULT_FEE } from '@taquito/taquito';
import { hasManager } from '../utils';
import { buildTransaction } from '../builder';
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
    pkHash,
    decimalsToken,
    privateKey,
    feeRatio = 0.5,
}: EstimateFeeParams): Promise<EstimateFeeResult> => {
    const built = await buildTransaction({
        source: from,
        destination: to,
        pkHash,
        value: amount,
        mintToken,
        idToken,
        privateKey,
        connector,
        decimalsToken,
        feeRatio,
    });
    return {
        fee: new BigNumber(built.fee)
            .plus(await feeReveal(from, connector))
            .toString(10),
    };
};
