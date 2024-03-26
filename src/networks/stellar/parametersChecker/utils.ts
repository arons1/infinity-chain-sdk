import { Server } from 'stellar-sdk';
import {
    InvalidAddress,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { AccountExists } from '../utils/types';
import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/stellar';

export const accountExistsParametersChecker = (props: AccountExists) => {
    if (!props.connector || !(props.connector instanceof Server))
        throw new Error(MissingOrInvalidConnector);
    if (isValidAddress(props.account)) throw new Error(InvalidAddress);
};
