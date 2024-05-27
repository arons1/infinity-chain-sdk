import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/solana';
import {
    ExceededLimit,
    InvalidAddress,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { Connection, PublicKey } from '@solana/web3.js';
import { GetAccountsTransactionsParams } from '../getTransactions/types';

export const getTransactionsParametersChecker = (
    props: GetAccountsTransactionsParams,
) => {
    if (
        !Array.isArray(props.accounts) ||
        props.accounts.find(a => !(a.pubkey instanceof PublicKey)) != undefined
    )
        throw new Error(InvalidAddress);
    if (!props.connector || !(props.connector instanceof Connection))
        throw new Error(MissingOrInvalidConnector);
    if (!isValidAddress(props.address)) throw new Error(InvalidAddress);
    if (props.limit && props.limit > 100) throw new Error(ExceededLimit);
};
