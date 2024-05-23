import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { GetAccountBalancesParams, GetAccountInfoParams } from './types';
import { BalanceResult, CurrencyBalanceResult } from '../../types';
import { CannotGetBalance } from '../../../errors/networks';

/**
 * Retrieves account information from the given connector and address.
 *
 * @param {GetAccountInfoParams} params - The parameters for retrieving account info.
 * @param {TrezorWebsocket} params.connector - The connector to use for retrieving account info.
 * @param {string} params.address - The address of the account to retrieve info for.
 * @return {Promise<string>} A promise that resolves to the combined balance of the account and its unconfirmed balance.
 */
const getAccountInfo = ({
    connector,
    address,
}: GetAccountInfoParams): Promise<string> => {
    return new Promise((resolve, reject) => {
        connector.send(
            'getAccountInfo',
            {
                descriptor: address,
                details: 'basic',
                page: 1,
                from: 1,
                to: 1,
            },
            (data: { balance: string; unconfirmedBalance: string }) => {
                if (!data || !data.balance) {
                    reject(new Error(CannotGetBalance));
                    return;
                }
                const balance = new BigNumber(data.balance);
                const unconfirmed_balance = new BigNumber(
                    data.unconfirmedBalance,
                );
                resolve(balance.plus(unconfirmed_balance).toString(10));
            },
        );
    });
};

/**
 * Retrieves the account balances for a list of extended public keys.
 *
 * @param {TrezorWebsocket} connector - The connector object.
 * @param {GetAccountBalancesParams} extendedPublicKeys - The list of extended public keys.
 * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
 */
export const getAccountBalances = async ({
    connector,
    extendedPublicKeys,
}: GetAccountBalancesParams): Promise<Record<string, BalanceResult[]>> => {
    const result: Record<string, BalanceResult[]> = {};
    for (let address of extendedPublicKeys) {
        const balances = await getAccountInfo({ address, connector });
        result[address] = [
            {
                value: balances,
            },
        ];
    }
    return result;
};

/**
 * Calculates the total balance for a list of extended public keys.
 *
 * @param {TrezorWebsocket} connector - The connector object used to retrieve account information.
 * @param {string[]} extendedPublicKeys - The list of extended public keys.
 * @return {Promise<CurrencyBalanceResult>} A promise that resolves to an object containing the total balance as a string.
 */
export const getBalance = async ({
    connector,
    extendedPublicKeys,
}: GetAccountBalancesParams): Promise<CurrencyBalanceResult> => {
    let balance = new BigNumber(0);
    for (let address of extendedPublicKeys) {
        const balances = await getAccountInfo({ address, connector });
        balance = balance.plus(balances);
    }
    return {
        balance: balance.toString(10),
    };
};
