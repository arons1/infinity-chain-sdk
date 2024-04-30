import { Connection } from '@solana/web3.js';
import { EstimateFeeParams } from '../estimateFee/types';
import {
    InvalidAddress,
    InvalidMemo,
    InvalidNumber,
    MissingMintTokenOrDecimalsTokens,
    MissingOrInvalidConnector,
} from '../../../errors/networks';
import {
    isValidAddress,
    isValidMemo,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/solana';
import { isValidNumber } from '@infinity/core-sdk/lib/commonjs/utils';

export const estimateFeeParametersChecker = (props: EstimateFeeParams) => {
    if (props.memo && !isValidMemo(props.memo)) throw new Error(InvalidMemo);
    if (!isValidAddress(props.destination)) throw new Error(InvalidAddress);
    if (!props.connector || !(props.connector instanceof Connection))
        throw new Error(MissingOrInvalidConnector);
    if (props.mintToken || props.decimalsToken) {
        if (!(props.mintToken && (props.decimalsToken as number) > 0))
            throw new Error(MissingMintTokenOrDecimalsTokens);
    }
    if (!isValidNumber(props.value)) throw new Error(InvalidNumber);
};
