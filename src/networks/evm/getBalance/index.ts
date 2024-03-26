import { CurrencyBalanceResult } from '../../types';
import { getBalanceParamsChecker } from '../parametersChecker';
import { BalanceParams } from './types';

/* 
getBalance
    Returns balance of the address
    @param connector: web3 connector
    @param address: address to get the balance from
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
