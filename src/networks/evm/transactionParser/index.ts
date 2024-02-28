import etherscanProvider from './etherscan';

export enum PROVIDERS {
    ETHERSCAN,
}
export const transactionParser = ({ type }: { type: PROVIDERS }) => {
    if (type == PROVIDERS.ETHERSCAN) {
        return etherscanProvider;
    }
    return;
};
