import Web3 from 'web3';
import { BalanceParams } from '../getBalance';
import {
    InvalidAddress,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/evm';

export const getBalanceParamsChecker = (props: BalanceParams) => {
    if (!props.connector || !(props.connector instanceof Web3))
        throw new Error(MissingOrInvalidConnector);
    if (props.address && !isValidAddress(props.address))
        throw new Error(InvalidAddress);
};
