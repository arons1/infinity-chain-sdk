import { PublicKey } from '@solana/web3.js';
import { CurrencyBalanceResult } from '../../types';
import { GetBalanceParams } from './types';
import { getBalanceParametersChecker } from '../parametersChecker';

/* 
getBalance
    Returns account balance
    @param address: string of the account to get the balance from
    @param connector: solana web3 connector
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
