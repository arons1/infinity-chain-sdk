import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/solana';
import {
    InvalidAddress,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { GetBalanceParams } from '../getBalance/types';
import { Connection } from '@solana/web3.js';

export const getBalanceParametersChecker = (props: GetBalanceParams) => {
    if (!isValidAddress(props.address)) throw new Error(InvalidAddress);
    if (!props.connector || !(props.connector instanceof Connection))
        throw new Error(MissingOrInvalidConnector);
};
