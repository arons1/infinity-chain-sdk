import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/solana';
import { CheckIfAccountExistsParams, GetAccountsParams } from '../utils/types';
import {
    InvalidAddress,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { Connection, PublicKey } from '@solana/web3.js';

export const getAccountsParametersChecker = (props: GetAccountsParams) => {
    if (!isValidAddress(props.address)) throw new Error(InvalidAddress);
    if (!props.connector || !(props.connector instanceof Connection))
        throw new Error(MissingOrInvalidConnector);
};
export const checkIfAccountExistsParametersChecker = (
    props: CheckIfAccountExistsParams,
) => {
    if (!props.connector || !(props.connector instanceof Connection))
        throw new Error(MissingOrInvalidConnector);
    if (!props.publicKey || !(props.publicKey instanceof PublicKey))
        throw new Error(MissingOrInvalidConnector);
    if (!props.mintToken) throw new Error(InvalidAddress);
};
