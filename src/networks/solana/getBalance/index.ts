import { PublicKey } from '@solana/web3.js';
import { CurrencyBalanceResult } from '../../types';
import { GetBalanceParams } from './types';
import { getBalanceParametersChecker } from '../parametersChecker';

/**
 * Returns the balance of the given account.
 *
 * @param {string} props.address - the account to get the balance from
 * @param {Connection} props.connector - solana web3 connector
 * @returns {Promise<CurrencyBalanceResult>} - the balance of the account
 */
export const getBalance = async (
    props: GetBalanceParams,
): Promise<CurrencyBalanceResult> => {
    getBalanceParametersChecker(props);
    return {
        balance: (
            await props.connector.getBalance(new PublicKey(props.address))
        ).toString(10),
    } as CurrencyBalanceResult;
};
export * from './tokens';
