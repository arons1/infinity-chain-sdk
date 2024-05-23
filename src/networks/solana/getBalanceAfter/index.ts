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
} from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';
import { getBalanceAfterParametersChecker } from '../parametersChecker';
import { getAccounts } from '../utils';
import { CannotEstimateTransaction } from '../../../errors/networks';

const getBalanceAfterVersioned = async ({
    accounts,
    connector,
    signer,
    transaction,
}: EstimateFeeParams): Promise<Record<string, DataBalance>> => {
    try {
        const estimate: RpcResponseAndContext<SimulatedTransactionResponse> =
            await connector.simulateTransaction(transaction, {
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
    } catch (e) {
        console.error(e);
        throw new Error(CannotEstimateTransaction);
    }
};
const getBalanceAfterLegacy = async ({
    accounts,
    connector,
    signer,
    transaction,
}: EstimateLegacyFeeParams): Promise<Record<string, DataBalance>> => {
    try {
        const estimate: RpcResponseAndContext<SimulatedTransactionResponse> =
            await connector.simulateTransaction(
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
    } catch (e) {
        console.error(e);
        throw new Error(CannotEstimateTransaction);
    }
};
/**
 * getBalanceAfter
 * Returns balance after of the accounts of the signer
 * @param {GetBalanceAfterParams} props
 * @param {VersionedTransaction|Transaction} props.transaction Transaction web3 solana
 * @param {Web3Connector} props.connector solana web3 connector
 * @returns {Promise<Record<string, DataBalance>>}
 */
export const getBalanceAfter = async (
    props: GetBalanceAfterParams,
): Promise<Record<string, DataBalance>> => {
    getBalanceAfterParametersChecker(props);
    const { connector, transaction, signer } = props;
    const accounts = await getAccounts({ address: signer, connector });
    if ('message' in transaction)
        return await getBalanceAfterVersioned({
            accounts: Array.from(
                new Set([
                    ...transaction.message.staticAccountKeys
                        .map(a => a.toString())
                        .filter(a =>
                            accounts.find(
                                b => b.pubkey.toString() == a.toString(),
                            ),
                        ),
                    signer,
                ]),
            ),
            connector,
            signer,
            transaction,
        });
    else {
        const accounts_insert: string[] = [];
        transaction.instructions.map(a =>
            a.keys.map(b => accounts_insert.push(b.pubkey.toString())),
        );
        return await getBalanceAfterLegacy({
            accounts: Array.from(
                new Set([
                    ...accounts_insert.filter(a =>
                        accounts.find(b => b.pubkey.toString() == a.toString()),
                    ),
                    signer,
                ]),
            ),
            connector,
            signer,
            transaction,
        });
    }
};
