import { isValidNumber } from "@infinity/core-sdk/lib/commonjs/utils";
import { InvalidAddress, InvalidFeeRatio, InvalidNumber, MissingOrInvalidConnector } from "../../../errors/networks";
import { isValidAddress,isValidPublicKey } from '@infinity/core-sdk/lib/commonjs/networks/utils/tezos';
import {
    TezosToolkit
} from '@taquito/taquito';
import { EstimateFeeParams } from "../estimateFee/types";

export const estimateFeeParametersChecker = (props:EstimateFeeParams) => {
    if(!isValidAddress(props.source)) throw new Error(InvalidAddress)
    if(!isValidAddress(props.destination)) throw new Error(InvalidAddress)
    if(props.mintToken && !isValidAddress(props.mintToken)) throw new Error(InvalidAddress)
    if (!props.connector || !(props.connector instanceof TezosToolkit))
        throw new Error(MissingOrInvalidConnector);
    if(!isValidPublicKey(props.pkHash)) throw new Error(InvalidAddress)
    if (props.feeRatio && (props.feeRatio < 0 || props.feeRatio > 1))
        throw new Error(InvalidFeeRatio);
    if(!props.decimalsToken && props.mintToken) throw new Error(InvalidAddress)
    if (!isValidNumber(props.value)) throw new Error(InvalidNumber);
    
}