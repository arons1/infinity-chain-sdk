import { PROVIDER_TREZOR } from '../../../constants';
import {
    CannotGetFeePerByte,
    CannotGetUTXO,
    CoinNotIntegrated,
    ErrorBuildingUTXOTransaction,
    InvalidAmount,
    ProtocolNotSupported,
    SpecifyChangePublic,
} from '../../../errors/networks';
import { DUST } from '../constants';
import { getFeePerByte } from '../estimateFee';
import { getUTXO } from '../getUTXO';
import { UTXOResult } from '../getUTXO/types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { BuildParameters, BuildTransactionResult } from './types';
import { networks } from '@infinity/core-sdk';
import { getLastChangeIndex } from '../getLastChangeIndex';
import {
    BIP32Interface,
    ECPair,
    Network,
    TransactionBuilder,
    opcodes,
    script,
} from 'bitcoinjs-lib';
/*
buildTransaction
    Returns transaction build result
    @param coinId: coin id
    @param amount: amount to send
    @param connector: trezorWebsocket object
    @param accounts: array of Account objects
    @param destination: where to send to
    @param memo: memo string (optional)
    @param utxos: utxo to use (optional)
    @param feeRatio: Fee ratio
*/
export const buildTransaction = async ({
    coinId,
    amount,
    connector,
    accounts,
    destination,
    memo = '',
    utxos = [],
    feeRatio = 0.5,
}: BuildParameters) : Promise<BuildTransactionResult> => {
    const selected = PROVIDER_TREZOR[coinId as string] as string;
    const network = networks.networks.default[coinId as string];
    if (accounts.find(a => a.useAsChange) == undefined)
        throw new Error(SpecifyChangePublic);
    if (!selected) throw new Error(CoinNotIntegrated);
    if (amount.includes('.')) throw new Error(InvalidAmount);
    // 1º Get UTXOs
    if (utxos.length == 0) {
        const extendedPublicKeys = accounts.map(a => a.extendedPublicKey);
        for (let extendedPublicKey of extendedPublicKeys)
            try {
                const utxos_address = await getUTXO({
                    extendedPublicKey,
                    connector,
                });
                utxos = [...utxos_address, ...utxos];
            } catch (e) {
                console.error(e);
                throw new Error(CannotGetUTXO);
            }
    }

    utxos = utxos.sort((a, b) => (a.path > b.path ? -1 : 1));
    var amountLeft = new BigNumber(amount);
    // 2º Select all UTXO necesary to fill the amount
    const utxosUsed: UTXOResult[] = [];
    var feeAcc = new BigNumber(78);
    if (memo.length > 0) feeAcc = feeAcc.plus(memo.length);
    let feePerByte;
    // 5º Get fee per byte
    try {
        feePerByte = await getFeePerByte({ connector });
    } catch (e) {
        console.error(e);
        throw new Error(CannotGetFeePerByte);
    }

    var tx = new TransactionBuilder(network as Network);
    const feeByte = new BigNumber(feePerByte.low)
        .plus(feePerByte.high)
        .multipliedBy(feeRatio);

    for (let utxo of utxos) {
        amountLeft = amountLeft.minus(utxo.value);
        if (utxo.protocol == 84) feeAcc = feeAcc.plus(68);
        else feeAcc = feeAcc.plus(148);

        utxosUsed.push(utxo);
        tx.addInput(
            utxo.txid,
            new BigNumber(utxo.vout).toNumber(),
            new BigNumber('0xfffffffd').toNumber(),
        );
        if (!amountLeft.plus(feeAcc.multipliedBy(feeByte)).isGreaterThan(0)) {
            break;
        }
    }
    // 3º Get the fee of inputs
    const feeInput = utxosUsed.reduce((p, v) => {
        if (v.protocol) return new BigNumber(68).plus(p);
        return new BigNumber(148).plus(p);
    }, new BigNumber(0));
    var feeOutput = new BigNumber(34);

    tx.addOutput(destination, new BigNumber(amount).toNumber());
    // 4º Add input if it needs a change address
    if (
        !amountLeft.plus(feeAcc.multipliedBy(feeByte)).isGreaterThanOrEqualTo(0)
    ) {
        const changeAmount = amountLeft
            .plus(feeAcc.multipliedBy(feeByte))
            .multipliedBy(-1);
        if (changeAmount.isGreaterThan(DUST[coinId])) {
            feeOutput = feeOutput.plus(34);
            var changeProtocol = 44;
            const { index, protocol } = await getLastChangeIndex({
                extendedPublicKey: accounts.find(a => a.useAsChange)
                    ?.extendedPublicKey as string,
                connector,
            });
            changeProtocol = protocol;
            var lastChangeIndex = index;

            let addressChange;

            if (changeProtocol == 49) {
                addressChange = networks.utxo.getPublicAddressP2WPKHP2S({
                    publicAccountNode: accounts.find(a => a.useAsChange)
                        ?.node as BIP32Interface,
                    change: 1,
                    index: lastChangeIndex,
                    network,
                });
            } else if (changeProtocol == 44) {
                addressChange = networks.utxo.getPublicAddressP2PKH({
                    publicAccountNode: accounts.find(a => a.useAsChange)
                        ?.node as BIP32Interface,
                    change: 1,
                    index: lastChangeIndex,
                    network,
                });
            } else if (changeProtocol == 84) {
                addressChange = networks.utxo.getPublicAddressSegwit({
                    publicAccountNode: accounts.find(a => a.useAsChange)
                        ?.node as BIP32Interface,
                    change: 1,
                    index: lastChangeIndex,
                    network,
                });
            } else {
                throw new Error(ProtocolNotSupported);
            }
            tx.addOutput(addressChange as string, changeAmount.toNumber());
        }
    }
    if (memo.length > 0) {
        feeOutput = feeOutput.plus(memo.length);
        tx.addOutput(script.compile([opcodes.OP_RETURN, Buffer.from(memo)]), 0);
    }

    for (var k = 0; k < utxosUsed.length; k++) {
        const unspent = utxosUsed[k];
        const [change, index] = unspent.path.split('/').slice(4);

        const keyPair = networks.utils.secp256k1.getPrivateKey({
            privateAccountNode: accounts.find(
                a => a.extendedPublicKey == unspent.extendedPublicKey,
            )?.node as BIP32Interface,
            change: parseInt(change),
            index: parseInt(index),
        });
        const privateKey = ECPair.fromWIF(keyPair.toWIF(), network as Network);
        if (unspent.protocol == 84) {
            tx.sign({
                prevOutScriptType: 'p2wpkh',
                vin: k,
                keyPair: privateKey,
                witnessValue: new BigNumber(unspent.value).toNumber(),
            });
        } else if (unspent.protocol == 49) {
            const redem = networks.utxo.getRedeemP2WPKH({
                publicKey: keyPair.publicKey,
                network,
            });
            tx.sign({
                prevOutScriptType: 'p2sh-p2wpkh',
                vin: k,
                keyPair: privateKey,
                redeemScript: redem,
                witnessValue: new BigNumber(unspent.value).toNumber(),
            });
        } else if (unspent.protocol == 44) {
            tx.sign(k, privateKey);
        } else {
            throw new Error(ProtocolNotSupported);
        }
    }
    let hex;
    try {
        hex = tx.build().toHex();
    } catch (e) {
        console.error(e);
        throw new Error(ErrorBuildingUTXOTransaction);
    }
    return {
        feePerByte,
        utxos,
        hex,
        utxosUsed,
        transactionSize: feeInput.plus(feeOutput).toString(10),
    };
};
