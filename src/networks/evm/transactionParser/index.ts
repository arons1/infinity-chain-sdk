import etherscanProvider from './etherscan';
import kccProvider from './kcc';

export enum PROVIDERS {
    ETHERSCAN,
    KCC
}
export const transactionParser = ({ type }: { type: PROVIDERS }) => {
    if (type == PROVIDERS.ETHERSCAN) {
        return etherscanProvider;
    }
    else if(type == PROVIDERS.KCC) {
        return kccProvider;
    }
    return;
};
