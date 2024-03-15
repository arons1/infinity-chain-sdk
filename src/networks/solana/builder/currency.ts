import { PublicKey, SystemProgram } from '@solana/web3.js';
import { CurrencyTransactionParams } from './types';
import BigNumber from 'bignumber.js';
import { memoInstruction } from '../utils';

export const currencyTransaction = async ({
    memo = '',
    keyPair,
    destination,
    amount,
}: CurrencyTransactionParams) => {
    const instructions: any = [
        SystemProgram.transfer({
            fromPubkey: keyPair.publicKey,
            toPubkey: new PublicKey(destination),
            lamports: new BigNumber(amount).toNumber(),
        }),
    ];
    if (memo && memo.length > 0) {
        instructions.push(memoInstruction(memo));
    }
    return instructions;
};
