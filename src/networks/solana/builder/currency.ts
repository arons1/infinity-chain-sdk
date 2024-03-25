import { PublicKey, SystemProgram } from '@solana/web3.js';
import { CurrencyTransactionParams } from './types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { memoInstruction } from '../utils';
/* 
currencyTransaction
    Returns currency transaction
    @param memo: memo (optional)
    @param publicKey: public key of the account
    @param destination: were to transfer to
    @param value: amount to transfer
*/
export const currencyTransaction = async ({
    memo = '',
    publicKey,
    destination,
    value,
}: CurrencyTransactionParams) => {
    const instructions: any = [
        SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(destination),
            lamports: new BigNumber(value).toNumber(),
        }),
    ];
    if (memo && memo.length > 0) {
        instructions.push(memoInstruction(memo));
    }
    return instructions;
};
