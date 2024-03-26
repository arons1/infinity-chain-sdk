import Web3 from 'web3';
import {
    InvalidNumber,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import { SendTransactionParams } from '../sendTransaction/types';
import { isHexString } from '@infinity/core-sdk/lib/commonjs/core/base';

export const sendTransactionParamsChecker = (props: SendTransactionParams) => {
    if (!props.connector || !(props.connector instanceof Web3))
        throw new Error(MissingOrInvalidConnector);
    if (props.rawTransaction && !isHexString(props.rawTransaction))
        throw new Error(InvalidNumber);
};
