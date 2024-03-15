import { TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { TransactionBuilderParams } from './types';
import { tokenTransaction } from './token';
import { currencyTransaction } from './currency';
import { getLastBlockhash } from '../utils';

export const buildTransaction = async (props: TransactionBuilderParams) => {
    const transactionPay = await rawTransaction(props);
    transactionPay.sign([props.keyPair]);
    return transactionPay.serialize();
};

export const rawTransaction = async ({
    memo = '',
    mintToken,
    decimalsToken,
    destination,
    publicKey,
    amount,
    web3,
}: TransactionBuilderParams) => {
    var instructions: any[] = [];
    const { blockhash } = await getLastBlockhash(web3);
    if (mintToken != undefined) {
        instructions = await tokenTransaction({
            memo,
            mintToken,
            decimalsToken: decimalsToken as number,
            destination,
            publicKey,
            amount,
            web3,
        });
    } else {
        instructions = await currencyTransaction({
            memo,
            amount,
            publicKey,
            destination,
        });
    }
    const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: instructions,
    }).compileToV0Message();
    return new VersionedTransaction(messageV0);
};
