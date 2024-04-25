import { GetAccountsTransactionsParams } from './types';
import { getBalance } from '../getBalance';
import { BalanceResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { getAccounts } from '../utils';

/**
 * getAccountBalances
 * Returns accounts balances
 * @param {GetAccountsTransactionsParams} options
 * @param {Connector} options.connector Solana web3 connector
 * @param {string[]} options.accounts Accounts to get the balance from
 * @returns {Promise<Record<string, BalanceResult[]>>}
 */
export const getAccountBalances = async ({
    connector,
    accounts,
}: GetAccountsTransactionsParams): Promise<Record<string, BalanceResult[]>> => {
    const formattedResult: Record<string, BalanceResult[]> = {};
    for (let address of accounts) {
        const accounts_balances = await getAccounts({ connector, address });
        const result: Record<string, number> = {};
        accounts_balances.map(account => {
            const parsedAccountInfo = account.account.data;
            const mintAddress: string =
                parsedAccountInfo['parsed']['info']['mint'];
            const tokenBalance: number =
                parsedAccountInfo['parsed']['info']['tokenAmount']['amount'];
            result[mintAddress] = tokenBalance;
        });
        try {
            result['native'] = new BigNumber(
                (await getBalance({ connector, address })).balance,
            ).toNumber();
        } catch {}
        for (let contract in result) {
            const balResult: BalanceResult = {
                address: contract,
                value: new BigNumber(result[contract]).toString(10),
            };
            if (!formattedResult[address]) {
                formattedResult[address] = [];
            }
            formattedResult[address].push(balResult);
        }
    }
    return formattedResult;
};
