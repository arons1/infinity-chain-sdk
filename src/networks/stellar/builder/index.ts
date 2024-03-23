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

export const preparePayment = async ({
    value,
    source,
    destination,
    connector,
    code,
    issuer,
    memo,
}: BuildTransactionParams): Promise<Transaction> => {
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

export const buildTransaction = async (
    props: BuildTransactionParams,
): Promise<string> => {
    const transaction: Transaction = await preparePayment(props);
    const key_pair = Keypair.fromSecret(props.keyPair.secret());
    transaction.sign(key_pair);
    return transaction.toEnvelope().toXDR('base64');
};
