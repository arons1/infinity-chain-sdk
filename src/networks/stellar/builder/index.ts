import {
    Keypair,
    Memo,
    Networks,
    Operation,
    Transaction,
    TransactionBuilder,
} from 'stellar-sdk';
import { estimateFee } from '../estimateFee';
import { accountExists, makeAsset } from '../utils';
import { BuildTransactionParams } from './types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { builderParametersChecker } from '../parametersChecker';

/**
 * Builds and returns a Stellar transaction
 *
 * @param {BuildTransactionParams} params Parameters object
 * @param {string} params.value The amount of tokens to transfer
 * @param {string} params.source The address of the account that pays the fee
 * @param {string} params.destination The address to transfer the tokens to
 * @param {Server} params.connector The StellarSdk connector
 * @param {string} [params.code] The code of the token to send to (optional)
 * @param {string} [params.issuer] The issuer of the token to send to (optional)
 * @param {string} [params.memo] The memo to include in the transaction (optional)
 *
 * @returns {Promise<Transaction>} The prepared transaction
 */
export const preparePayment = async ({ value, source, destination, connector, code, issuer, memo }:BuildTransactionParams):Promise<Transaction> => {
    const account = await connector.loadAccount(source);
    var transaction: TransactionBuilder = new TransactionBuilder(account, {
        fee: new BigNumber((await estimateFee()).fee as string).toString(10),
        networkPassphrase: Networks.PUBLIC,
    });
    const destinationExists = await accountExists({
        connector,
        account: destination,
    });
    if (!destinationExists) {
        transaction.addOperation(
            Operation.createAccount({
                destination,
                startingBalance: new BigNumber(value)
                    .shiftedBy(-7)
                    .toString(10),
            }),
        );
    } else {
        transaction.addOperation(
            Operation.payment({
                destination,
                asset: makeAsset(code, issuer),
                amount: new BigNumber(value).shiftedBy(-7).toString(10),
            }),
        );
    }

    if (memo) {
        transaction.addMemo(Memo.text(memo));
    }
    return transaction.setTimeout(30).build();
};

/**
 * Returns a prepared transaction signed with the given keypair
 *
 * @param {BuildTransactionParams} props
 * @param {string} props.value Value to transfer
 * @param {string} props.source Fee payer
 * @param {string} props.destination Address to transfer to
 * @param {Server} props.connector Stellar api connector
 * @param {string} [props.code] Code issuer of the token to send to (optional)
 * @param {string} [props.issuer] Address issuer of the token to send to (optional)
 * @param {string} [props.memo] Memo to place in the transaction (optional)
 * @param {Keypair} props.keyPair Key pair to sign the transaction
 *
 * @returns {Promise<string>} The signed transaction in base64 XDR
 */
export const buildTransaction = async (
    props: BuildTransactionParams,
): Promise<string> => {
    builderParametersChecker(props);
    const transaction: Transaction = await preparePayment(props);
    const key_pair = Keypair.fromSecret(props.keyPair.secret());
    transaction.sign(key_pair);
    return transaction.toEnvelope().toXDR('base64');
};
