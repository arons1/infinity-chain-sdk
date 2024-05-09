import { TokenTransfer, Transaction } from '../../../networks/types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { HashesDetails } from '../../../networks/solana/getTransactions/types';
export const encode = ({
    transaction,
    account,
    accounts,
    hash,
}: {
    transaction: HashesDetails;
    account: string;
    accounts: string[];
    hash: string;
}): Transaction | undefined => {
    // account index
    if (
        !transaction.details ||
        !transaction.details.meta ||
        !transaction.details.meta.fee ||
        !transaction.details.meta.preTokenBalances ||
        !transaction.details.meta.postTokenBalances ||
        !transaction.details.blockTime
    )
        return;
    let accountsIndexes = transaction.details.transaction.message.accountKeys;
    let accountIndex = -1;
    let out = 0;
    for (let i = 0; i < accountsIndexes.length; i++) {
        if (accountsIndexes[i].pubkey.toString() == account) {
            accountIndex = i;
            if (accountsIndexes[i].signer) out = 1;
            break;
        }
    }

    let fee = transaction.details.meta.fee;

    // balanceChanges

    let balanceBefore =
        accountIndex == -1
            ? 0
            : transaction.details.meta.preBalances[accountIndex];
    let balanceAfter =
        accountIndex == -1
            ? 0
            : transaction.details.meta.postBalances[accountIndex];
    let blockheight = transaction.details.slot;
    let time = transaction.details.blockTime * 1000;
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
        let valueToken = new BigNumber(postBalance.uiTokenAmount.amount).minus(
            preBalance.uiTokenAmount.amount,
        );
        let outToken = 0;
        if (!valueToken.isGreaterThanOrEqualTo(0)) {
            outToken = 1;
            valueToken = valueToken.multipliedBy(-1);
        }

        let otherSender = transaction.details.meta.postTokenBalances.filter(
            a => a.owner != account && a.mint == preBalance.mint,
        )[0];
        const from =
            outToken == 0 && otherSender?.owner ? otherSender.owner : account;
        const to =
            outToken == 0 || otherSender?.owner == undefined
                ? account
                : otherSender.owner;
        const mint = preBalance.mint;
        const tokenTransfer: TokenTransfer = {
            from,
            to,
            value: valueToken.toString(10),
            contractAddress: mint,
        };

        tokenTransfers.push(tokenTransfer);
    }

    let value = new BigNumber(balanceBefore).minus(balanceAfter);
    if (!value.isGreaterThanOrEqualTo(0)) {
        value = value.multipliedBy(-1);
        if (out == 1) {
            out = 0;
        }
    }
    if (out == 1) {
        value = value.minus(fee);
    }
    let confirmations = '0';
    if (transaction.details.blockTime != undefined) confirmations = '6';
    let from;
    let to;
    if (out == 1) {
        from = account;
        let auxSending =
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
        blockNumber: blockheight + '',
        timeStamp: new Date(time).toISOString(),
        hash,
        from,
        to,
        value: value.toString(10),
        fee: fee + '',
        confirmations,
        tokenTransfers,
        isError: transaction.details.meta.err != undefined,
        type: 'solana',
    };
};
