import { GeneralTransactionEncode } from './types';
import { Transaction } from '../../../networks/types';

export const encode = ({
    transaction,
    last_block,
}: {
    transaction: GeneralTransactionEncode;
    last_block: number;
}): Transaction | undefined => {
    if (
        transaction.action_trace.act == undefined ||
        transaction.action_trace.act.name != 'trnsfiopubky'
    ) {
        return;
    }
    const jsonAux = JSON.parse(transaction.action_trace.receipt.response);
    let confirmations = transaction.block_num < last_block ? '7' : '0';
    return {
        blockNumber: transaction.block_num + '',
        timeStamp: transaction.block_time + '',
        hash: transaction.action_trace.trx_id,
        from: transaction.action_trace.act.data.actor,
        to: transaction.action_trace.act.data.payee_public_key,
        fee: jsonAux.fee_collected,
        confirmations,
        isError: transaction.action_trace.error_code != null,
        type: 'fio',
    };
};
