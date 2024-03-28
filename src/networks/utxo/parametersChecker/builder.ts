import { isValidNumber } from '@infinity/core-sdk/lib/commonjs/utils';
import { PROVIDER_TREZOR } from '../../../constants';
import {
    CoinNotIntegrated,
    InvalidAddress,
    InvalidAmount,
    InvalidExtenedPublicKey,
    InvalidFeeRatio,
    InvalidUTXO,
    MissingOrInvalidConnector,
    SpecifyChangePublic,
} from '../../../errors/networks';
import { BuildParameters } from '../builder/types';
import { InvalidNetworkVersion } from '@infinity/core-sdk/lib/commonjs/errors';
import { TrezorWebsocket } from '../trezorWebsocket';
import {
    isValidAddress,
    isValidExtendedKey,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/utxo';
import { isValidPath } from '@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1';
import { Network } from 'bitcoinjs-lib';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';

/*
    utxos?: UTXOResult[] | undefined;
*/
export const builderParametersChecker = (props: BuildParameters) => {
    const selected = PROVIDER_TREZOR[props.coinId] as string;
    const network = config[props.coinId].network;
    if (
        Array.isArray(props.accounts) &&
        props.accounts.find(a => a.useAsChange) == undefined
    )
        throw new Error(SpecifyChangePublic);
    if (!selected || selected.length == 0) throw new Error(CoinNotIntegrated);
    if (!isValidNumber(props.amount)) throw new Error(InvalidAmount);
    if (!network) throw new Error(InvalidNetworkVersion);
    if (props.feeRatio && (props.feeRatio < 0 || props.feeRatio > 1))
        throw new Error(InvalidFeeRatio);
    if (!props.connector || !(props.connector instanceof TrezorWebsocket))
        throw new Error(MissingOrInvalidConnector);
    if (
        !props.destination &&
        !isValidAddress(props.destination, network as Network)
    )
        throw new Error(InvalidAddress);
    if (
        props.accounts.find(
            a => !isValidExtendedKey(a.extendedPublicKey, network as Network),
        ) != undefined
    )
        throw new Error(InvalidExtenedPublicKey);
    if (
        props.utxos &&
        props.utxos.find(
            a =>
                !isValidAddress(a.address, network as Network) ||
                !isValidExtendedKey(a.extendedPublicKey, network as Network) ||
                !isValidPath(a.path) ||
                !isValidNumber(a.protocol) ||
                typeof a.txid != 'string' ||
                !isValidNumber(a.value) ||
                !isValidNumber(a.vout),
        ) != undefined
    )
        throw new Error(InvalidUTXO);
};
