import { isValidMemo } from '@infinity/core-sdk/lib/commonjs/networks/utils/stellar';
import { BuildTransactionParams } from '../builder/types';
import {
    InvalidAddress,
    InvalidMemo,
    InvalidNumber,
    MissingKeyPair,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/stellar';
import { isValidNumber } from '@infinity/core-sdk/lib/commonjs/utils';
import { Keypair, Server } from 'stellar-sdk';

export const builderParametersChecker = async (
    props: BuildTransactionParams,
) => {
    if (props.memo && !isValidMemo(props.memo)) throw new Error(InvalidMemo);
    if (!isValidAddress(props.destination)) throw new Error(InvalidAddress);
    if (!isValidAddress(props.source)) throw new Error(InvalidAddress);
    if (props.issuer && !isValidAddress(props.issuer))
        throw new Error(InvalidAddress);
    if (!props.connector || !(props.connector instanceof Server))
        throw new Error(MissingOrInvalidConnector);
    if (!isValidNumber(props.value)) throw new Error(InvalidNumber);
    if (!props.keyPair || !(props.keyPair instanceof Keypair))
        throw new Error(MissingKeyPair);
};
