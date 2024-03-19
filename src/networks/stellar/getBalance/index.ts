import BigNumber from 'bignumber.js';
import { GetBalanceParams, ResultBalanceRPC } from './types';
import { CurrencyBalanceResult } from '../../types';

export const getBalance = async ({
    account,
    api,
}: GetBalanceParams): Promise<CurrencyBalanceResult> => {
    const accountBalances = await api.loadAccount(account);
    const balanceCurrency = new BigNumber(
        accountBalances.balances.find(
            (a: ResultBalanceRPC) => a.asset_type == 'native',
        ).balance,
    )
        .shiftedBy(7)
        .toString(10);
    return {
        balance: balanceCurrency,
        reserve: new BigNumber(10000000)
            .plus(
                new BigNumber(
                    accountBalances.subentry_count * 0.5,
                ).multipliedBy(10000000),
            )
            .toString(10),
    } as CurrencyBalanceResult;
};
export * from './tokens';
