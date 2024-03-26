import { XrplClient } from 'xrpl-client';
import {
    InvalidAddress,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { AccountExists } from '../utils/types';
import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/xrp';

export const accountExistsParamsChecker = (props: AccountExists) => {
    if (!isValidAddress(props.account)) throw new Error(InvalidAddress);
    if (!props.connector || !(props.connector instanceof XrplClient))
        throw new Error(MissingOrInvalidConnector);
};
