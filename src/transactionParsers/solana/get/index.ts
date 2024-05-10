import { getAccounts, getAccountsTransactions } from '../../../networks/solana';
import { Transaction } from '../../../networks/types';
import general from '../general';
import { SolanaParams } from './types';

const LIMIT = 100;
/**
 * Retrieves transactions for a given address using Solana blockchain.
 *
 * @param {SolanaParams} address - The address to fetch transactions for.
 * @param {Connection} connector - The connection to the Solana network.
 * @param {Record<string, string>} signatures - Optional signatures for the transactions already saved in the wallet.
 * @param {GetAccountsResult[]} accounts - Optional accounts to consider for transactions. If not provided, all accounts will be considered.
 * @return {Promise<Transaction[]>} An array of transactions for the given address.
 */
export const getTransactions = async ({
    address,
    connector,
    signatures = {},
    accounts,
}: SolanaParams): Promise<Transaction[]> => {
    const accounts_real =
        accounts ??
        (await getAccounts({
            address,
            connector,
        }));
    const { hashes } = await getAccountsTransactions({
        address,
        accounts: accounts_real,
        signatures,
        limit: LIMIT,
        connector,
    });
    const result: Transaction[] = [];
    Object.values(hashes).map(a => {
        const tr = general.encode({
            transaction: a,
            hash: a.details?.transaction.signatures[0] as string,
            account: address,
            accounts: accounts_real.map(b => b.pubkey.toString()),
        });
        if (tr) result.push(tr);
    });
    return result;
};
