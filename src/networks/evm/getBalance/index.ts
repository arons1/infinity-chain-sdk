import { CurrencyBalanceResult } from '../../types';
import { BalanceParams } from './types';

/* 
getBalance
    Returns balance of the address
    @param connector: web3 connector
    @param address: address to get the balance from
*/
export const getBalance = async ({
    address,
    connector,
}: BalanceParams): Promise<CurrencyBalanceResult> => {
    return {
        balance: (await connector.eth.getBalance(address, 'latest')).toString(
            10,
        ),
    } as CurrencyBalanceResult;
};
export * from './tokens';
export * from './types';
