import { Connection, PublicKey } from '@solana/web3.js';
import { CurrencyBalanceResult } from '../../types';

export const getBalance = async ({
    connector,
    address,
}: {
    connector: Connection;
    address: string;
}): Promise<CurrencyBalanceResult> => {
    return {
        balance: (await connector.getBalance(new PublicKey(address))).toString(10),
    } as CurrencyBalanceResult;
};
export * from './tokens';
