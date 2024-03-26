import Web3 from "web3";
import { InvalidNumber, MissingOrInvalidConnector } from "../../../errors/networks";
import { SendTransactionParams } from "../sendTransaction/types";
import { isValidNumber } from "@infinity/core-sdk/lib/commonjs/utils";

export const sendTransactionParamsChecker = (props:SendTransactionParams) => {
    if(!props.connector || !(props.connector instanceof Web3))
        throw new Error(MissingOrInvalidConnector)
    if(props.rawTransaction && !isValidNumber(props.rawTransaction))
        throw new Error(InvalidNumber)
}