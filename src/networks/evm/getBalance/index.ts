import { CurrencyBalanceResult } from '../../types';
import { BalanceParams } from './types';

export const getBalance = async ({
    address,
    connector,
}: BalanceParams): Promise<CurrencyBalanceResult> => {
    return {
        balance: (await connector.eth.getBalance(address, 'latest')).toString(
            10,
        ),
    } as CurrencyBalanceResult;
};
export * from './tokens';
export * from './types';
