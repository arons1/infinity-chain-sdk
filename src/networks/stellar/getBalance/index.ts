import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { GetBalanceParams } from './types';
import { CurrencyBalanceResult } from '../../types';
import { AccountResponse } from 'stellar-sdk';

export const getBalance = async ({
    account,
    connector,
}: GetBalanceParams): Promise<CurrencyBalanceResult> => {
    const accountBalances: AccountResponse =
        await connector.loadAccount(account);
    const balanceCurrency = new BigNumber(
        accountBalances?.balances?.find(a => a.asset_type == 'native')
            ?.balance as string,
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
