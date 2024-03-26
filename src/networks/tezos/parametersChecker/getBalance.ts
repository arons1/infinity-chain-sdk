import { isValidAddress } from "@infinity/core-sdk/lib/commonjs/networks/utils/stellar";
import { InvalidAddress } from "../../../errors/networks";

export const getBalanceParametersChecker = (address:string) => {
    if (!isValidAddress(address)) throw new Error(InvalidAddress);
}