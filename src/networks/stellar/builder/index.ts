import { getFee } from '../estimateFee';
import { accountExists, makeAsset } from '../utils';
import { BuildTransactionParams } from './types';
import StellarSdk from 'stellar-sdk';
import { signTransaction } from '@infinity/core/ed25519';

export const preparePayment = async ({
    value,
    source,
    destination,
    api,
    code,
    issuer,
    memo,
}: BuildTransactionParams) => {
    const account = await api.loadAccount(source);
    var transaction = new StellarSdk.TransactionBuilder(account, {
        fee: await getFee(),
        networkPassphrase: StellarSdk.Networks.PUBLIC,
    });

    const destinationNoExists = await accountExists({
        api,
        account: destination,
    });
    if (destinationNoExists) {
        transaction = transaction.addOperation(
            StellarSdk.Operation.createAccount({
                destination: destination,
                startingBalance: value,
            }),
        );
    } else {
        transaction = transaction.addOperation(
            StellarSdk.Operation.payment({
                destination: destination,
                asset: makeAsset(code, issuer),
                amount: value,
            }),
        );
    }

    if (memo) {
        transaction = transaction.addMemo(StellarSdk.Memo.text(memo));
    }
    transaction = transaction.setTimeout(30).build();
    return transaction;
};

export const buildTransaction = async (
    props: BuildTransactionParams,
): Promise<string> => {
    const transaction = await preparePayment(props);
    return signTransaction({
        transaction,
        keyPair: props.keyPair,
        coinId: 'stellar',
    });
};
