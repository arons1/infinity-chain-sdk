import { CurrencyBalanceResult } from '../../types';
import { BalanceParams } from './types';

export const getBalance = async ({
    address,
    web3,
}: BalanceParams): Promise<CurrencyBalanceResult> => {
    return {
        balance: await web3.eth.getBalance(address, 'latest'),
    };
};
export * from './tokens';
export * from './types';
