import {
    InvalidAddress,
    InvalidFeeRatio,
    InvalidNumber,
    MissingOrInvalidConnector,
    MissingPriorityFee,
} from '../../../errors/networks';
import { UnsupportedChainId } from '../../../errors/transactionParsers';
import { isValidNumber } from '@infinity/core-sdk/lib/commonjs/utils';
import Web3 from 'web3';
import { SupportedChains } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/evm';

import { EstimateGasParams } from '../estimateFee';

export const estimateParametersChecker = (props: EstimateGasParams) => {
    if (!isValidAddress(props.source)) throw new Error(InvalidAddress);
    if (props.destination && !isValidAddress(props.destination))
        throw new Error(InvalidAddress);
    if (!SupportedChains.includes(props.chainId))
        throw new Error(UnsupportedChainId);
    if (props.value && !isValidNumber(props.value))
        throw new Error(InvalidNumber);
    if (props.feeRatio && (props.feeRatio < 0 || props.feeRatio > 1))
        throw new Error(InvalidFeeRatio);
    if (props.gasPrice && !isValidNumber(props.gasPrice))
        throw new Error(InvalidNumber);
    if (props.priorityFee && !isValidNumber(props.priorityFee))
        throw new Error(InvalidNumber);
    if (!props.connector || !(props.connector instanceof Web3))
        throw new Error(MissingOrInvalidConnector);
    if (!props.priorityFee && (props.chainId == 1 || props.chainId == 137))
        throw new Error(MissingPriorityFee);
};
