import { Connection, PublicKey } from '@solana/web3.js';
import { CurrencyBalanceResult } from '../../types';

/* 
getBalance
    Returns account balance
    @param address: string of the account to get the balance from
    @param connector: solana web3 connector
*/
export const getBalance = async ({
    connector,
    address,
}: {
    connector: Connection;
    address: string;
}): Promise<CurrencyBalanceResult> => {
    return {
        balance: (await connector.getBalance(new PublicKey(address))).toString(
            10,
        ),
    } as CurrencyBalanceResult;
};
export * from './tokens';
