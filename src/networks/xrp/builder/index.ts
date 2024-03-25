import { signTransaction } from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import { Payment, BuildTransactionParams, PreparePaymentParams } from './types';

const LEDGER_OFFSET = 20;

export const preparePayment = async ({
    tx,
    connector,
}: PreparePaymentParams) => {
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
export const buildTransaction = async ({
    amount,
    from,
    to,
    keyPair,
    connector,
    memo = '',
}: BuildTransactionParams): Promise<string> => {
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
        coinId: 'xrp',
    });
};
