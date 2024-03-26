import { isValidAddress } from '@infinity/core-sdk/lib/commonjs/networks/utils/fio';
import { InvalidAddress } from '../../../errors/networks';

export const getAddressFromAccountParametersChecker = (address: string) => {
    if (!address || !isValidAddress(address)) throw new Error(InvalidAddress);
};
