import BigNumber from 'bignumber.js';
import { GetBalanceParams, ResultBalanceRPC } from './types';
import { BalanceResult } from '../../types';

export const getAccountBalances = async ({
    account,
    api,
}: GetBalanceParams): Promise<Record<string, BalanceResult[]>> => {
    const accountBalances = await api.loadAccount(account);
    const reserve = new BigNumber(10000000)
        .plus(new BigNumber(accountBalances.subentry_count * 0.5).shiftedBy(7))
        .toString(10);
    const result: Record<string, BalanceResult[]> = {
        [account]: [],
    };
    for (let balance of accountBalances.balances) {
        const balanceRes: ResultBalanceRPC = balance;
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
            result[account].push({
                address: balanceRes.asset_issuer,
                code: balanceRes.asset_code,
                value: new BigNumber(balanceRes.balance)
                    .shiftedBy(7)
                    .toString(10),
            });
        }
    }
    return result;
};
