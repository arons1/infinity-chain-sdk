import { signTransaction } from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import { Payment, BuildTransactionParams, PreparePaymentParams } from './types';
import {
    builderParametersChecker,
    preparePaymentParametersChecker,
} from '../parametersChecker/builder';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';

const LEDGER_OFFSET = 20;

/**
 * Prepares a payment by checking and setting transaction properties.
 *
 * @param {PreparePaymentParams} props - The parameters for the payment.
 * @return {Promise<Transaction>} The prepared payment transaction.
 */
export const preparePayment = async (props: PreparePaymentParams) => {
    preparePaymentParametersChecker(props);
    const { tx, connector } = props;
    if (tx.Sequence == undefined) {
        const request = {
            command: 'account_info',
            account: tx.Account,
            ledger_index: 'current',
        };
        const data = await connector.send(request, {
            timeoutSeconds: 5,
        });
        tx.Sequence = data.account_data.Sequence;
    }
    if (tx.LastLedgerSequence == undefined) {
        tx.LastLedgerSequence =
            connector.getState().ledger.last + LEDGER_OFFSET;
    }
    if (tx.Fee == undefined) {
        tx.Fee = connector.getState().fee.last + '';
    }
    return tx;
};

/**
 * Builds a transaction based on the provided parameters and returns the signed transaction as a string.
 *
 * @param {BuildTransactionParams} props - An object containing the following properties:
 *   - amount: The amount of the transaction in XRP.
 *   - from: The sender's XRP address.
 *   - to: The recipient's XRP address.
 *   - keyPair: The sender's key pair.
 *   - connector: The XRP connector.
 *   - memo (optional): The memo for the transaction.
 * @return {Promise<string>} A promise that resolves to the signed transaction as a string.
 */
export const buildTransaction = async (
    props: BuildTransactionParams,
): Promise<string> => {
    builderParametersChecker(props);
    const { amount, from, to, keyPair, connector, memo = '' } = props;
    const tx = {
        TransactionType: 'Payment',
        Amount: amount,
        Destination: to,
        Account: from,
    } as Payment;
    if (memo.length > 0) tx.DestinationTag = memo;
    const txPrepared = await preparePayment({ connector, tx });
    return signTransaction({
        transaction: txPrepared,
        keyPair,
        coinId: Coins.XRP,
    });
};
