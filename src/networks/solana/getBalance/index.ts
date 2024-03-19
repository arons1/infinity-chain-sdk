import { Connection, PublicKey } from '@solana/web3.js';
import { CurrencyBalanceResult } from '../../types';

export const getBalance = async ({
    web3,
    address,
}: {
    web3: Connection;
    address: string;
}): Promise<CurrencyBalanceResult> => {
    return {
        balance: (await web3.getBalance(new PublicKey(address))).toString(10),
    } as CurrencyBalanceResult;
};
export * from './tokens';
