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
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import { CannotBuildTransaction } from '../../../errors/networks';

/**
 * Builds a signed raw transaction
 * @param {Object} props
 * @param {string} [props.memo] - transaction memo (optional)
 * @param {KeyPair} props.keyPair - key pair
 * @param {string} [props.mintToken] - mint of the token to transfer (optional)
 * @param {string} props.destination - receiver of the transfer
 * @param {number} [props.decimalsToken] - decimals of the token to transfer (optional)
 * @param {string} props.value - amount to transfer
 * @param {Web3} props.connector - solana web3 connector
 * @returns {Promise<string>} signed raw transaction
 */
export const buildTransaction = async (
    props: TransactionBuilderParams,
): Promise<string> => {
    builderParametersChecker(props);
    try {
        const transactionPay = await rawTransaction({
            ...props,
            publicKey: new PublicKey(props.keyPair.publicKey),
        });

        return signTransaction({
            transaction: transactionPay,
            keyPair: Web3.Keypair.fromSecretKey(props.keyPair.secretKey),
            coinId: Coins.SOLANA,
        });
    } catch (e) {
        console.error(e);
        throw new Error(CannotBuildTransaction);
    }
};

/**
 * Returns raw transaction
 * @param {string} memo - memo (optional)
 * @param {string} mintToken - mint of the token to transfer (optional)
 * @param {number} decimalsToken - decimals of the token to transfer (optional)
 * @param {string} destination - receiver of the transfer
 * @param {PublicKey} publicKey - public key source
 * @param {string} value - amount to transfer
 * @param {Web3} connector - solana web3 connector
 * @returns {Promise<VersionedTransaction>}
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
    let instructions: any[] = [];
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
