import { isHexString } from '@infinity/core-sdk/lib/commonjs/core/base';
import Web3 from 'web3';
import {
    InvalidRawTransaction,
    MissingOrInvalidConnector,
} from '../../../errors/networks';

export const estimateFeeParametersChecker = (
    connector: Web3,
    rawTransaction: string,
) => {
    if (!isHexString(rawTransaction)) throw new Error(InvalidRawTransaction);
    if (!connector || !(connector instanceof Web3))
        throw new Error(MissingOrInvalidConnector);
};
