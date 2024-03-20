import { TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { RawTransactionParams, TransactionBuilderParams } from './types';
import { tokenTransaction } from './token';
import { currencyTransaction } from './currency';
import { getLastBlockhash } from '../utils';
import { signTransaction } from '@infinity/core-sdk/lib/commonjs/networks/ed25519';

export const buildTransaction = async (props: TransactionBuilderParams) => {
    const transactionPay = await rawTransaction({
        ...props,
        publicKey: props.keyPair.publicKey,
    });
    return signTransaction({
        transaction: transactionPay,
        keyPair: props.keyPair,
        coinId: 'solana',
    });
};

export const rawTransaction = async ({
    memo = '',
    mintToken,
    decimalsToken,
    destination,
    publicKey,
    amount,
    web3,
}: RawTransactionParams) => {
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
