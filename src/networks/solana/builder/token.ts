import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    createTransferCheckedInstruction,
} from '@solana/spl-token';
import { AddAssociatedCreationParams, TokenTransactionParams } from './types';
import { PublicKey } from '@solana/web3.js';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import {
    checkIfAccountExists,
    getMinimumBalanceForRent,
    memoInstruction,
} from '../utils';

export const addAssociatedCreation = async ({
    instructions,
    mintToken,
    destination,
    publicKey,
    web3,
}: AddAssociatedCreationParams) => {
    const [checkSender, associatedTokenSender] = await checkIfAccountExists({
        mintToken,
        publicKey,
        web3,
    });
    var extraFee = 0;
    var iterations = 0;
    if (!checkSender) {
        const inst = createAssociatedTokenAccountInstruction(
            publicKey,
            associatedTokenSender,
            publicKey,
            new PublicKey(mintToken),
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        instructions.push(inst);
        iterations += 1;
    }

    const [checkReceiver, associatedTokenReceiver] = await checkIfAccountExists(
        {
            mintToken,
            publicKey: new PublicKey(destination),
            web3,
        },
    );
    if (!checkReceiver) {
        const inst = createAssociatedTokenAccountInstruction(
            publicKey,
            associatedTokenReceiver,
            new PublicKey(destination),
            new PublicKey(mintToken),
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        instructions.push(inst);
        iterations += 1;
    }
    if (iterations > 0) {
        const resTr = await getMinimumBalanceForRent(web3, true);
        extraFee += resTr * iterations;
    }
    return {
        senderTokenAccount: associatedTokenSender,
        receiverTokenAccount: associatedTokenReceiver,
        extraFee,
    };
};
export const tokenTransaction = async ({
    memo = '',
    mintToken,
    destination,
    publicKey,
    decimalsToken,
    value,
    web3,
}: TokenTransactionParams) => {
    const instructions: any = [];
    const { senderTokenAccount, receiverTokenAccount } =
        await addAssociatedCreation({
            instructions,
            mintToken,
            destination,
            publicKey,
            web3,
        });
    const transactionSpl = createTransferCheckedInstruction(
        senderTokenAccount, // from
        new PublicKey(mintToken), // mint
        receiverTokenAccount, // to
        publicKey, // from's owner
        new BigNumber(value).toNumber(), // amount
        decimalsToken, // decimals
    );
    instructions.push(transactionSpl);
    if (memo && memo.length > 0) {
        instructions.push(memoInstruction(memo));
    }
    return instructions;
};
