import { GetBalanceParams, ResultBalance } from './types';

export const getBalance = async ({
    account,
    api,
}: GetBalanceParams): Promise<ResultBalance> => {
    const accountBalances = await api.loadAccount(account);
    return accountBalances.balances;
};
