import { XrplClient } from 'xrpl-client';
import {
    InvalidAddress,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { GetBalanceParams } from '../getBalance/types';
import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/xrp';

export const getBalanceParamsChecker = (props: GetBalanceParams) => {
    if (!props.connector || !(props.connector instanceof XrplClient))
        throw new Error(MissingOrInvalidConnector);
    if (!isValidAddress(props.address)) throw new Error(InvalidAddress);
};
