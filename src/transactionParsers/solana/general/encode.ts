import { GeneralTransactionEncode } from './types';
import { TokenTransfer, Transaction } from '../../../networks/types';
import BigNumber from 'bignumber.js';
export const encode = ({
    transaction,
    account,
    accounts,
    hash,
}: {
    transaction: GeneralTransactionEncode;
    account: string;
    accounts: string[];
    hash: string;
}): Transaction | undefined => {
    // account index
    var accountsIndexes = transaction.details.transaction.message.accountKeys;
    var accountIndex = -1;
    var out = 0;
    for (var i = 0; i < accountsIndexes.length; i++) {
        if (accountsIndexes[i].pubkey.toString() == account) {
            accountIndex = i;
            if (accountsIndexes[i].signer) out = 1;
            break;
        }
    }

    var fee = transaction.details.meta.fee;

    // balanceChanges

    var balanceBefore =
        accountIndex == -1
            ? 0
            : transaction.details.meta.preBalances[accountIndex];
    var balanceAfter =
        accountIndex == -1
            ? 0
            : transaction.details.meta.postBalances[accountIndex];
    var blockheight = transaction.details.slot;
    var time = transaction.details.blockTime * 1000;
    const filteredPreTokens = transaction.details.meta.preTokenBalances.filter(
        a => a.owner == account,
    );
    const postBalancesAux = transaction.details.meta.postTokenBalances.filter(
        a => a.owner == account,
    );
    const notIn = postBalancesAux.filter(
        a => filteredPreTokens.find(b => b.mint == a.mint) == undefined,
    );
    for (let nIn of notIn) {
        const auxnIn = { ...nIn };
        auxnIn.uiTokenAmount = { ...nIn.uiTokenAmount };
        auxnIn.uiTokenAmount.amount = '0';
        auxnIn.uiTokenAmount.uiAmount = 0;
        auxnIn.uiTokenAmount.uiAmountString = '0';
        filteredPreTokens.push(auxnIn);
    }
    const tokenTransfers: TokenTransfer[] = [];
    for (let preBalance of filteredPreTokens) {
        const postBalance = transaction.details.meta.postTokenBalances.filter(
            a => a.owner == account && a.mint == preBalance.mint,
        )[0];
        if (postBalance == undefined) continue;
        var value = new BigNumber(postBalance.uiTokenAmount.amount).minus(
            preBalance.uiTokenAmount.amount,
        );
        var outToken = 0;
        if (!value.isGreaterThanOrEqualTo(0)) {
            outToken = 1;
            value = value.multipliedBy(-1);
        }

        var otherSender = transaction.details.meta.postTokenBalances.filter(
            a => a.owner != account && a.mint == preBalance.mint,
        )[0];
        const from = outToken == 0 && otherSender ? otherSender.owner : account;
        const to =
            outToken == 0 || otherSender == undefined
                ? account
                : otherSender.owner;
        const mint = preBalance.mint;
        const tokenTransfer: TokenTransfer = {
            from,
            to,
            value: value.toString(10),
            contractAddress: mint,
        };

        tokenTransfers.push(tokenTransfer);
    }

    var value = new BigNumber(balanceBefore).minus(balanceAfter);
    if (!value.isGreaterThanOrEqualTo(0)) {
        value = value.multipliedBy(-1);
        if (out == 1) {
            out = 0;
        }
    }
    if (out == 1) {
        value = value.minus(fee);
    }
    var confirmations = '0';
    if (
        transaction.details.meta.status != undefined &&
        Object.keys(transaction.details.meta.status).includes('Ok')
    )
        confirmations = '6';
    let from;
    let to;
    if (out == 1) {
        from = account;
        var auxSending =
            transaction.details.transaction.message.accountKeys.filter(
                a => !a.signer && !accounts.includes(a.pubkey.toString()),
            );
        if (auxSending.length > 0) {
            if (auxSending.filter(a => a.writable).length > 0)
                auxSending = auxSending.filter(a => a.writable);
            to = auxSending[0].pubkey.toString();
        } else {
            to = 'No destination';
        }
    } else {
        to = account;
        from = transaction.details.transaction.message.accountKeys
            .filter(a => a.signer)[0]
            .pubkey.toString();
    }

    return {
        blockNumber: blockheight,
        timeStamp: new Date(time).toISOString(),
        hash,
        from,
        to,
        value: value.toString(10),
        fee,
        confirmations,
        tokenTransfers,
        isError: transaction.details.meta.status.Err != undefined,
        type: 'solana',
    };
};
