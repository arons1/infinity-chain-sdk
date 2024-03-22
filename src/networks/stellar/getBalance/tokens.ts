import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { GetBalanceParams } from './types';
import { BalanceResult } from '../../types';
import { AccountResponse, Horizon } from 'stellar-sdk';
export const getAccountBalances = async ({
    account,
    api,
}: GetBalanceParams): Promise<Record<string, BalanceResult[]>> => {
    const accountBalances: AccountResponse = await api.loadAccount(account);
    const reserve = new BigNumber(10000000)
        .plus(new BigNumber(accountBalances.subentry_count * 0.5).shiftedBy(7))
        .toString(10);
    const result: Record<string, BalanceResult[]> = {
        [account]: [],
    };
    for (let balanceRes of accountBalances.balances) {
        if (!result[account]) {
            result[account] = [] as BalanceResult[];
        }
        if (balanceRes.asset_type == 'native') {
            result[account].push({
                address: balanceRes.asset_type,
                value: new BigNumber(balanceRes.balance)
                    .shiftedBy(7)
                    .plus(reserve)
                    .toString(10),
                freeze: new BigNumber(balanceRes.balance)
                    .shiftedBy(7)
                    .toString(10),
            });
        } else {
            const balance: Horizon.BalanceLineAsset<'credit_alphanum4'> =
                balanceRes as Horizon.BalanceLineAsset<'credit_alphanum4'>;
            result[account].push({
                address: balance.asset_issuer,
                code: balance.asset_code,
                value: new BigNumber(balanceRes.balance)
                    .shiftedBy(7)
                    .toString(10),
            });
        }
    }
    return result;
};
