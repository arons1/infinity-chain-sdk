import { CannotGetBalance } from '../../../errors/networks';
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
    try{
        return {
            balance: (
                await props.connector.eth.getBalance(props.address, 'latest')
            ).toString(10),
        } as CurrencyBalanceResult;
    }
    catch(error:any){
        throw new Error(error.code ?? CannotGetBalance);
    }

};
export * from './tokens';
export * from './types';
