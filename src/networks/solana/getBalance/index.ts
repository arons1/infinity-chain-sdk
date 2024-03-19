import { PublicKey } from '@solana/web3.js';
import { CurrencyBalanceResult } from '../../types';

export const getBalance = async ({
    web3,
    address,
}: {
    web3: any;
    address: string;
}): Promise<CurrencyBalanceResult> => {
    return {
        balance: await web3.getBalance(new PublicKey(address)),
    } as CurrencyBalanceResult;
};
export * from './tokens';
