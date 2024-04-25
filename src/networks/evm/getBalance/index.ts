import { CurrencyBalanceResult } from '../../types';
import { getBalanceParamsChecker } from '../parametersChecker';
import { BalanceParams } from './types';


/**
 * getBalance
 * Returns balance of the address
 * @param {Web3} connector Web3 connector
 * @param {string} address Address to get the balance from
 * @returns {Promise<CurrencyBalanceResult>}
 */
export const getBalance = async (
    props: BalanceParams,
): Promise<CurrencyBalanceResult> => {
    getBalanceParamsChecker(props);
    return {
        balance: (
            await props.connector.eth.getBalance(props.address, 'latest')
        ).toString(10),
    } as CurrencyBalanceResult;
};
export * from './tokens';
export * from './types';
