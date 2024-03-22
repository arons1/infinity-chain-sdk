import {
    DataBalance,
    EstimateFeeParams,
    EstimateLegacyFeeParams,
    GetBalanceAfterParams,
} from './types';
import {
    PublicKey,
    RpcResponseAndContext,
    SimulatedTransactionResponse,
    Transaction,
    VersionedTransaction,
} from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';

const getBalanceAfterVersioned = async ({
    accounts,
    web3,
    signer,
    transaction,
}: EstimateFeeParams): Promise<Record<string, DataBalance>> => {
    const estimate: RpcResponseAndContext<SimulatedTransactionResponse> =
        await web3.simulateTransaction(transaction, {
            accounts: {
                encoding: 'base64',
                addresses: accounts,
            },
        });
    const accounts_after: Record<string, DataBalance> = {};
    estimate?.value?.accounts?.map((a, i) => {
        if (a != undefined && a.data[0].length > 0) {
            try {
                const decodedTokenAccountInfo = AccountLayout.decode(
                    Buffer.from(a.data[0], 'base64'),
                );
                if (decodedTokenAccountInfo.owner.toString() == signer) {
                    accounts_after[accounts[i] as string] = {
                        amount: decodedTokenAccountInfo.amount.toString(),
                        mint: decodedTokenAccountInfo.mint.toString(),
                    };
                }
            } catch {}
        }
        if (a && accounts[i] == signer)
            accounts_after[accounts[i]] = {
                amount: a.lamports.toString(),
            };
    });
    return accounts_after;
};
const getBalanceAfterLegacy = async ({
    accounts,
    web3,
    signer,
    transaction,
}: EstimateLegacyFeeParams): Promise<Record<string, DataBalance>> => {
    const estimate: RpcResponseAndContext<SimulatedTransactionResponse> =
        await web3.simulateTransaction(
            transaction,
            undefined,
            accounts.map(a => new PublicKey(a)),
        );
    const accounts_after: Record<string, DataBalance> = {};
    estimate?.value?.accounts?.map((a, i) => {
        if (a != undefined && a?.owner == signer && a.data[0].length > 0) {
            try {
                const decodedTokenAccountInfo = AccountLayout.decode(
                    Buffer.from(a.data[0], 'base64'),
                );
                if (decodedTokenAccountInfo.owner.toString() == signer) {
                    accounts_after[accounts[i] as string] = {
                        amount: decodedTokenAccountInfo.amount.toString(),
                        mint: decodedTokenAccountInfo.mint.toString(),
                    };
                }
            } catch {}
        }
        if (a && accounts[i] == signer)
            accounts_after[accounts[i]] = {
                amount: a.lamports.toString(),
            };
    });
    return accounts_after;
};
export const getBalanceAfter = async ({
    web3,
    transaction,
    signer,
}: GetBalanceAfterParams): Promise<Record<string, DataBalance>> => {
    if ('message' in transaction)
        return await getBalanceAfterVersioned({
            accounts: transaction.message.staticAccountKeys.map(a =>
                a.toString(),
            ),
            web3,
            signer,
            transaction: transaction as VersionedTransaction,
        });
    else {
        const accounts: string[] = [];
        const castTransaction = transaction as Transaction;
        castTransaction.instructions.map(a =>
            a.keys.map(b => accounts.push(b.pubkey.toString())),
        );
        return await getBalanceAfterLegacy({
            accounts,
            web3,
            signer,
            transaction: transaction as Transaction,
        });
    }
};
