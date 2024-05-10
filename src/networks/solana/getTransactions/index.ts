import { ParsedTransactionWithMeta, SolanaJSONRPCError } from '@solana/web3.js';
import { SLEEP_BETWEEN_CALLS } from '../../../constants';
import {
    AddressesFormat,
    GetAccountsHashesParams,
    GetAccountsTransactionsHashesParams,
    GetAccountsTransactionsParams,
    GetBatchAddressesWithPaginationParams,
    GetTransactionsParams,
    HashesDetails,
    HashesResult,
    PaginationData,
    ResultSignature,
} from './types';
import { create } from 'superstruct';
import { GetSignaturesForAddressRpcResult } from './results';
import { sleep } from '../utils';
import { getTransactionsParametersChecker } from '../parametersChecker';
const LIMIT_CALLS = 1000;
const LIMIT_BATCH = 20;

/**
 * Retrieves the hashes of accounts from the specified Solana network.
 *
 * @param {GetAccountsHashesParams} params - The parameters for retrieving the account hashes.
 * @param {Connector} params.connector - The Solana web3 connector.
 * @param {string} params.address - The address to retrieve the account hashes from.
 * @param {string[]} params.accounts - The accounts of the tokens.
 * @param {string[]} params.signatures - The signatures of the transactions already saved in the wallet.
 * @param {number} [params.limit=1000] - The limit of transactions per batch (optional).
 * @returns {Promise<HashesResult[]>} - The account hashes.
 */
export const getAccountsHashes = async ({
    connector,
    address,
    accounts,
    signatures,
    limit,
}: GetAccountsHashesParams) => {
    let numberLast = -1;
    let transactionHashes = [];
    for (;;) {
        transactionHashes = await getAccountsTransactionsHashes({
            connector,
            accounts,
            address,
            signatures,
            limit,
        });
        await sleep(SLEEP_BETWEEN_CALLS);
        const numberOfHashes = transactionHashes.reduce(
            (p: number, v: HashesResult) => p + v.result.length,
            0,
        );
        if (numberOfHashes == numberLast) break;
        numberLast = numberOfHashes;
    }
    return transactionHashes;
};

/**
 * Retrieves the details of transactions based on their hashes.
 *
 * @param {GetTransactionsParams} params - The parameters for retrieving transactions.
 * @param {string[]} params.pendingTransactions - The array of transaction hashes to retrieve details for.
 * @param {Connector} params.connector - The Solana web3 connector.
 * @return {Promise<ParsedTransactionWithMeta[]>} A promise that resolves to an array of parsed transaction details.
 */
export const getTransactions = async ({
    pendingTransactions,
    connector,
}: GetTransactionsParams) => {
    let transactionsRes: ParsedTransactionWithMeta[] = [];
    let hashes: Record<string, boolean> = {};
    while (pendingTransactions.length > 0) {
        for (let i = 0; i < pendingTransactions.length; i += LIMIT_BATCH) {
            const hashesPending = pendingTransactions.slice(i, i + LIMIT_BATCH);
            const detailsTransactions: ParsedTransactionWithMeta[] =
                (await connector.getParsedTransactions(hashesPending, {
                    maxSupportedTransactionVersion: 0,
                    commitment: 'confirmed',
                })) as ParsedTransactionWithMeta[];
            transactionsRes = [
                ...transactionsRes,
                ...detailsTransactions.filter(a => a != undefined),
            ];
            await sleep(SLEEP_BETWEEN_CALLS);
        }
        for (let tr of transactionsRes) {
            hashes[tr.transaction.signatures[0]] = true;
        }

        pendingTransactions = pendingTransactions.filter(
            a => hashes[a] == undefined,
        );
    }
    return transactionsRes;
};
/**
 * getAccountsTransactions
 *
 * Returns transactions details of the hashes passed
 * @param {GetAccountsTransactionsParams} props
 * @param {Web3} props.connector Solana web3 connector
 * @param {string} props.address Address to get the transactions from
 * @param {string[]} props.accounts Accounts of the tokens
 * @param {string[]} props.signatures Hashes of the transactions already saved in the wallet
 * @param {number} [props.limit=1000] Limit of transactions per batch(optional)
 * @returns {Promise<HashesResult[]>}
 */
export const getAccountsTransactions = async (
    props: GetAccountsTransactionsParams,
) => {
    getTransactionsParametersChecker(props);
    const {
        connector,
        address,
        accounts,
        signatures,
        limit = LIMIT_CALLS,
    } = props;
    const transactionHashes = await getAccountsHashes({
        connector,
        address,
        accounts,
        signatures,
        limit,
    });

    let pendingTransactions: string[] = [];
    transactionHashes.map(
        a => (pendingTransactions = [...pendingTransactions, ...a.result]),
    );
    pendingTransactions = Array.from(new Set(pendingTransactions));
    const detailsTransactions = await getTransactions({
        pendingTransactions,
        connector,
    });
    let hashes: Record<string, HashesDetails> = {};
    transactionHashes.map(accountHashes => {
        accountHashes.result.map(hash => {
            hashes[hash] = {
                mint: accountHashes.address,
            };
        });
    });
    for (let tr of detailsTransactions) {
        if (tr != undefined) {
            hashes[tr.transaction.signatures[0]].details = tr;
        }
    }

    return { hashes, accounts };
};

const getAccountsTransactionsHashes = async ({
    connector,
    address,
    accounts,
    signatures,
    limit,
}: GetAccountsTransactionsHashesParams): Promise<HashesResult[]> => {
    const acc_array: AddressesFormat[] = accounts.map(a => {
        return {
            mint: a.account.data.parsed.info.mint as string,
            address: a.pubkey.toString(),
        };
    });
    acc_array.push({
        mint: 'native',
        address: address,
    });
    const pagination = {};
    let result: any[] = [];
    for (let i = 0; i < acc_array.length; i += LIMIT_BATCH) {
        const accounts = acc_array.slice(i, i + LIMIT_BATCH);
        const resultBatchs = await getBatchAddressesWithPagination({
            connector,
            accounts,
            signatures: signatures ?? {},
            pagination,
            limit: limit as number,
        });
        result = [...result, ...resultBatchs];
    }
    return result;
};

const getBatchAddressesWithPagination = async ({
    connector,
    accounts,
    signatures,
    pagination,
    limit,
}: GetBatchAddressesWithPaginationParams) => {
    const batchResults = await getBatchAddresses({
        connector,
        accounts,
        signatures,
        pagination,
        limit,
    });
    await sleep(SLEEP_BETWEEN_CALLS);
    const resultBatchs = batchResults.map((a, index) => {
        return {
            ...accounts[index],
            result: a.map(b => b.signature),
        };
    });
    let needRecall = false;
    for (const element of resultBatchs) {
        const address = element.address;
        if (element.result.length == LIMIT_CALLS) {
            pagination[address] = element.result[LIMIT_CALLS - 1];
            needRecall = true;
        } else {
            if (pagination[address] != undefined) delete pagination[address];
            accounts = accounts.filter(a => address != a.address);
        }
    }
    if (needRecall) {
        const resultBatchsAux = await getBatchAddressesWithPagination({
            connector,
            accounts,
            signatures,
            pagination,
            limit,
        });
        for (const element of resultBatchsAux) {
            for (let j = 0; j < resultBatchs.length; j++) {
                if (resultBatchs[j].address == element.address) {
                    resultBatchs[j].result = [
                        ...resultBatchs[j].result,
                        ...element.result,
                    ];
                    break;
                }
            }
        }
    }

    return resultBatchs;
};
const getBatchAddresses = async ({
    connector,
    accounts,
    signatures,
    pagination,
    limit,
}: GetBatchAddressesWithPaginationParams): Promise<ResultSignature[][]> => {
    const batch = accounts.map(({ address }) => {
        const data: PaginationData = { limit };
        if (pagination[address]) data.before = pagination[address];
        if (signatures[address]) data.until = signatures[address];
        const args = connector._buildArgsAtLeastConfirmed(
            [address],
            undefined,
            undefined,
            data,
        );
        return {
            methodName: 'getSignaturesForAddress',
            args,
        };
    });

    const unsafeRes = await connector._rpcBatchRequest(batch);
    const res = unsafeRes.map((unsafeRes: any) => {
        const res = create(unsafeRes, GetSignaturesForAddressRpcResult);
        if ('error' in res) {
            throw new SolanaJSONRPCError(
                res.error,
                'failed to get transactions',
            );
        }
        return res.result;
    });

    return res;
};
