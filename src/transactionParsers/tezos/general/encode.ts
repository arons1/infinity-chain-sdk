import { GeneralTransactionEncode } from './types';
import { TokenTransfer, Transaction } from '../../../networks/types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

const operations = [
    'delegation',
    'origination',
    'transaction',
    'reveal',
    'migration',
    'revelation_penalty',
    'baking',
];
export const encode = ({
    transaction,
    account,
}: {
    transaction: GeneralTransactionEncode;
    account: string;
}): Transaction | undefined => {
    if (operations.find(a => a == transaction.type) == undefined) return;
    const tokenTransfers: TokenTransfer[] = [];
    let fee = new BigNumber(0);
    if (transaction.bakerFee) {
        fee = fee.plus(transaction.bakerFee);
    }
    if (transaction.allocationFee) {
        fee = fee.plus(transaction.allocationFee);
    }
    if (transaction.storageFee) {
        fee = fee.plus(transaction.storageFee);
    }
    let value =
        transaction.amount == undefined
            ? new BigNumber(0)
            : new BigNumber(transaction.amount);
    const confirm = transaction.status == 'applied' ? 6 : 0;
    if (transaction.initiator) {
        if (transaction.initiator.address == account) {
            if (transaction?.target?.address == account) {
                value = value.minus(fee);
            }
        }
    }
    let mint =
        transaction.target == undefined
            ? transaction.sender.address
            : transaction.target.address;
    if (transaction.parameter) {
        let transfer = transaction.parameter;
        if (transfer.entrypoint == 'transfer') {
            if (Array.isArray(transfer.value)) {
                for (let values of transfer.value) {
                    for (let tx_sender of values.txs) {
                        if (tx_sender.to_ != account && values.from_ != account)
                            continue;
                        let outToken = tx_sender.to_ != account ? 1 : 0;
                        if (outToken == 0) continue;
                        tokenTransfers.push({
                            to: tx_sender.to_,
                            from: values.from_,
                            value: tx_sender.amount + '',
                            id: (tx_sender.token_id ?? 0) + '',
                            contractAddress: mint,
                        });
                    }
                }
            } else {
                if (
                    transfer.value?.to == account ||
                    transfer.value?.from == account
                ) {
                    tokenTransfers.push({
                        from: transfer.value.from,
                        to: transfer.value.to,
                        value: transfer.value.value,
                        id: '0',
                        contractAddress: mint,
                    });
                }
            }
        }
    }

    if (transaction.type == 'delegation') {
        value = new BigNumber(0);
    }
    if (
        transaction.target &&
        transaction.sender &&
        transaction.sender.address == account &&
        transaction.target.address == account
    )
        value = new BigNumber(0);

    if (
        transaction.target &&
        transaction.sender &&
        transaction.sender.address != account &&
        transaction.target.address != account
    )
        value = new BigNumber(0);

    return {
        blockNumber: transaction.block,
        timeStamp: transaction.timestamp,
        hash: transaction.hash,
        from: transaction.sender.address,
        fromAlias: transaction.sender.alias,
        to:
            transaction.target == undefined
                ? transaction.sender.address
                : transaction.target.address,
        toAlias:
            transaction.target == undefined
                ? transaction.sender.alias
                : transaction.target.alias,
        value: value.toString(10),
        fee: fee.toString(10),
        confirmations: confirm + '',
        tokenTransfers,
        isError: transaction.status == 'failed',
        extraId: transaction.id + '',
        type: 'tezos',
    };
};
