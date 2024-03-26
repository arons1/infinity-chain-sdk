import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/solana';
import {
    InvalidAddress,
    MissingOrInvalidConnector,
    MissingTransaction,
} from '../../../errors/networks';
import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import { GetBalanceAfterParams } from '../getBalanceAfter/types';

export const getBalanceAfterParametersChecker = (
    props: GetBalanceAfterParams,
) => {
    if (!isValidAddress(props.signer)) throw new Error(InvalidAddress);
    if (!props.connector || !(props.connector instanceof Connection))
        throw new Error(MissingOrInvalidConnector);
    if (
        !(props.transaction instanceof Transaction) &&
        !(props.transaction instanceof VersionedTransaction)
    )
        throw new Error(MissingTransaction);
};
