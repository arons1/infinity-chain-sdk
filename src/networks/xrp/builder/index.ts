import { Payment,BuildTransactionParams,PreparePaymentParams } from "./types"
import {signTransaction} from '@infinity/core/ed25519'

const LEDGER_OFFSET = 20

export const preparePayment = async ({
    tx,
    api
}:PreparePaymentParams) => {
    if(tx.Sequence == undefined)
    {
        const request = {
        command: 'account_info',
        account: tx.Account,
        ledger_index: 'current'
        }
        const data = await api.send(request,{
            timeoutSeconds:5
        })
        tx.Sequence = data.account_data.Sequence
    }
    if(tx.LastLedgerSequence  == undefined){
        tx.LastLedgerSequence = api.getState().ledger.last + LEDGER_OFFSET
    }
    if(tx.Fee == undefined){
        tx.Fee = api.getState().fee.last+''
    }
    return JSON.stringify(tx);
}
export const buildTransaction = async ({
    amount,
    from,
    to,
    keyPair,
    api,
    memo = ''
}:BuildTransactionParams) => {
    const tx = {
        TransactionType: 'Payment',
        Amount: amount,
        Destination: to,
        Account:from
    } as Payment
    if(memo.length > 0)
        tx.DestinationTag = memo
    const txPrepared=  await preparePayment({api,tx})
    return signTransaction({
        transaction:txPrepared,
        keyPair,
        coinId:'xrp'
    })
}