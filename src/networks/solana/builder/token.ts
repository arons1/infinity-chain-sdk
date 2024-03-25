import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    createTransferCheckedInstruction,
} from '@solana/spl-token';
import { AddAssociatedCreationParams, TokenTransactionParams } from './types';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import {
    checkIfAccountExists,
    getMinimumBalanceForRent,
    memoInstruction,
} from '../utils';
/* 
addAssociatedCreation
    Add associated creation account of a token to the instructions of a transaction
    @param instructions,
    @param mintToken,
    @param destination,
    @param publicKey,
    @param connector
*/
export const addAssociatedCreation = async ({
    instructions,
    mintToken,
    destination,
    publicKey,
    connector,
}: AddAssociatedCreationParams) => {
    const [checkSender, associatedTokenSender] = await checkIfAccountExists({
        mintToken,
        publicKey,
        connector,
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
            connector,
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
        const resTr = await getMinimumBalanceForRent(connector, true);
        extraFee += resTr * iterations;
    }
    return {
        senderTokenAccount: associatedTokenSender,
        receiverTokenAccount: associatedTokenReceiver,
        extraFee,
    };
};
/* 
tokenTransaction
    Returns instructions for making a token transaction
    @param memo: memo string (optional)
    @param mintToken: mint of the token to transfer
    @param destination: receiver of the transfer
    @param publicKey: public key source
    @param decimalsToken: decimals of the token to transfer
    @param value: value to transfer
    @param connector: web3 solana connector
*/
export const tokenTransaction = async ({
    memo = '',
    mintToken,
    destination,
    publicKey,
    decimalsToken,
    value,
    connector,
}: TokenTransactionParams) : Promise<TransactionInstruction[]> => {
    const instructions: TransactionInstruction[] = [];
    const { senderTokenAccount, receiverTokenAccount } =
        await addAssociatedCreation({
            instructions,
            mintToken,
            destination,
            publicKey,
            connector,
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
