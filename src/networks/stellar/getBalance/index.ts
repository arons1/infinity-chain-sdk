import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { GetBalanceParams } from './types';
import { CurrencyBalanceResult } from '../../types';
import { AccountResponse } from 'stellar-sdk';
import { getBalanceParametersChecker } from '../parametersChecker';

/**
 * @function getBalance
 *
 * @description Returns balance of the account
 *
 * @param {GetBalanceParams} props
 * @param {string} props.account - account to get the balance from
 * @param {Server} props.connector - Stellar api connector
 *
 * @returns {Promise<CurrencyBalanceResult>}
 */
export const getBalance = async (props: GetBalanceParams): Promise<CurrencyBalanceResult> => {
    getBalanceParametersChecker(props);
    const accountBalances: AccountResponse = await props.connector.loadAccount(
        props.account,
    );
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
