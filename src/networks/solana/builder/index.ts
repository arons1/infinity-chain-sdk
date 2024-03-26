import {
    PublicKey,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js';
import { RawTransactionParams, TransactionBuilderParams } from './types';
import { tokenTransaction } from './token';
import { currencyTransaction } from './currency';
import { getLastBlockhash } from '../utils';
import { signTransaction } from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import * as Web3 from '@solana/web3.js';
import { builderParametersChecker } from '../parametersChecker';
/* 
buildTransaction
    Returns raw transaction built signed
    @param memo: memo (optional)
    @param keyPair: key pair
    @param mintToken: mint of the token to transfer (optional)
    @param destination: receiver of the transfer
    @param decimalsToken?: decimals of the token to transfer (optional)
    @param value: amount to transfer
    @param connector: solana web3 connector
*/
export const buildTransaction = async (
    props: TransactionBuilderParams,
): Promise<string> => {
    builderParametersChecker(props);
    const transactionPay = await rawTransaction({
        ...props,
        publicKey: new PublicKey(props.keyPair.publicKey),
    });

    return signTransaction({
        transaction: transactionPay,
        keyPair: Web3.Keypair.fromSecretKey(props.keyPair.secretKey),
        coinId: 'solana',
    });
};
/* 
rawTransaction
    Returns raw transaction
    @param memo: memo (optional)
    @param publicKey: public key source
    @param mintToken: mint of the token to transfer (optional)
    @param destination: receiver of the transfer
    @param decimalsToken: decimals of the token to transfer (optional)
    @param value: amount to transfer
    @param connector: solana web3 connector
*/
export const rawTransaction = async ({
    memo = '',
    mintToken,
    decimalsToken,
    destination,
    publicKey,
    value,
    connector,
}: RawTransactionParams): Promise<VersionedTransaction> => {
    var instructions: any[] = [];
    const { blockhash } = await getLastBlockhash(connector);
    if (mintToken != undefined) {
        instructions = await tokenTransaction({
            memo,
            mintToken,
            decimalsToken: decimalsToken as number,
            destination,
            publicKey,
            value,
            connector,
        });
    } else {
        instructions = await currencyTransaction({
            memo,
            value,
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
