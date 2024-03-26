import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/stellar';
import {
    InvalidAddress,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { GetBalanceParams } from '../getBalance/types';
import { Server } from 'stellar-sdk';

export const getBalanceParametersChecker = (props: GetBalanceParams) => {
    if (!isValidAddress(props.account)) throw new Error(InvalidAddress);
    if (!props.connector || !(props.connector instanceof Server))
        throw new Error(MissingOrInvalidConnector);
};
