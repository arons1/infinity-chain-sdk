import { PublicKey, SystemProgram } from '@solana/web3.js';
import { CurrencyTransactionParams } from './types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { memoInstruction } from '../utils';

/**
 * Returns currency transaction
 * @param {Object} options
 * @param {string} [options.memo] - memo (optional)
 * @param {PublicKey} options.publicKey - public key of the account
 * @param {string} options.destination - where to transfer to
 * @param {number|string|BigNumber} options.value - amount to transfer
 * @returns {Promise<TransactionInstruction[]>}
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
