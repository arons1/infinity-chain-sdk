import { PROVIDER_TREZOR } from '../../../constants';
import { EstimateFeeParams } from './types';
import {
    CannotGetUTXO,
    CoinNotIntegrated,
    InvalidAmount,
    CannotGetFeePerByte,
} from '../../../errors/networks';
import { MissingExtendedKey } from '../../../errors/transactionParsers';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { DUST } from '../constants';
import { UTXOResult } from '../getUTXO/types';
import { getUTXO } from '../getUTXO';
import { EstimateFeeResult } from '../../types';

export const getFeePerByte = ({
    trezorWebsocket,
}: {
    trezorWebsocket: any;
}): Promise<{
    low: string;
    high: string;
}> => {
    return new Promise((resolve, reject) => {
        trezorWebsocket.send(
            'estimateFee',
            {
                blocks: [1, 2, 3, 4],
            },
            (result: { feePerUnit: string }[]) => {
                if (
                    result &&
                    result.length == 4 &&
                    result[0].feePerUnit != undefined
                ) {
                    const finalResult = result
                        .reduce((l, n) => {
                            var feeUsed = new BigNumber(n.feePerUnit);
                            if (!feeUsed.isGreaterThan(0))
                                feeUsed = feeUsed.multipliedBy(-1);
                            return l.plus(feeUsed);
                        }, new BigNumber(0))
                        .dividedBy(result.length);
                    resolve({
                        low: finalResult
                            .multipliedBy(0.5)
                            .toString(10)
                            .split('.')[0],
                        high: finalResult
                            .multipliedBy(1.7)
                            .toString(10)
                            .split('.')[0],
                    });
                } else reject();
            },
        );
    });
};

export const estimateFee = async ({
    extendedPublicKeys,
    coinId,
    amount,
    trezorWebsocket,
    feeRatio = 0.5,
}: EstimateFeeParams): Promise<EstimateFeeResult> => {
    if (extendedPublicKeys == undefined || extendedPublicKeys.length == 0)
        throw new Error(MissingExtendedKey);
    const selected = PROVIDER_TREZOR[coinId as string] as string;
    if (!selected) throw new Error(CoinNotIntegrated);
    if (amount.includes('.')) throw new Error(InvalidAmount);
    // 1º Get UTXOs
    var utxos: UTXOResult[] = [];
    for (let extendedPublicKey of extendedPublicKeys)
        try {
            const utxos_address = await getUTXO({
                extendedPublicKey,
                trezorWebsocket,
            });
            utxos = [...utxos_address, ...utxos];
        } catch (e) {
            console.error(e);
            throw new Error(CannotGetUTXO);
        }
    utxos = utxos.sort((a, b) => (a.path > b.path ? -1 : 1));
    var amountLeft = new BigNumber(amount);
    // 2º Select all UTXO necesary to fill the amount
    const utxosUsed: UTXOResult[] = [];
    for (let utxo of utxos) {
        amountLeft = amountLeft.minus(utxo.value);
        utxosUsed.push(utxo);
        if (!amountLeft.isGreaterThan(0)) {
            break;
        }
    }
    // 3º Get the fee of inputs
    const feeInput = utxosUsed.reduce((p, v) => {
        if (v.protocol == 84) return new BigNumber(68).plus(p);
        return new BigNumber(148).plus(p);
    }, new BigNumber(0));
    var feeOutput = new BigNumber(34);
    // 4º Add input if it needs a change address
    if (!amountLeft.isGreaterThanOrEqualTo(0)) {
        const changeAmount = amountLeft.multipliedBy(-1);
        if (changeAmount.isGreaterThan(DUST[coinId])) {
            feeOutput = feeOutput.plus(34);
        }
    }
    let feePerByte;
    // 5º Get fee per byte
    try {
        feePerByte = await getFeePerByte({ trezorWebsocket });
    } catch (e) {
        console.error(e);
        throw new Error(CannotGetFeePerByte);
    }
    const selectedFeePerByteLow = new BigNumber(feePerByte.low)
        .plus(feePerByte.high)
        .multipliedBy(feeRatio);

    return {
        feePerByte,
        utxos,
        utxosUsed,
        transactionSize: feeInput.plus(feeOutput).toString(10),
        fee: feeInput
            .plus(feeOutput)
            .multipliedBy(selectedFeePerByteLow)
            .toString(10),
    };
};
