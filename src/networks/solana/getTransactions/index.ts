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
const LIMIT_CALLS = 1000;
const LIMIT_BATCH = 20;

export const getAccountsHashes = async ({
    web3,
    address,
    accounts,
    signatures,
    limit,
}: GetAccountsHashesParams) => {
    var numberLast = -1;
    var transactionHashes = [];
    for (;;) {
        transactionHashes = await getAccountsTransactionsHashes({
            web3,
            accounts,
            address,
            signatures,
            limit,
        });
        await sleep(SLEEP_BETWEEN_CALLS);
        const numberOfHashes = transactionHashes.reduce(
            (p: number, v: HashesResult) => p + v.hashes.length,
            0,
        );
        if (numberOfHashes == numberLast) break;
        numberLast = numberOfHashes;
    }
    return transactionHashes;
};

export const getTransactions = async ({
    pendingTransactions,
    web3,
}: GetTransactionsParams) => {
    var transactionsRes: ParsedTransactionWithMeta[] = [];
    var hashes: Record<string, boolean> = {};
    while (pendingTransactions.length > 0) {
        for (let i = 0; i < pendingTransactions.length; i += LIMIT_BATCH) {
            const hashesPending = pendingTransactions.slice(i, i + LIMIT_BATCH);
            const detailsTransactions: ParsedTransactionWithMeta[] =
                (await web3.getParsedTransactions(hashesPending, {
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

export const getAccountsTransactions = async ({
    web3,
    address,
    accounts,
    signatures,
    limit = LIMIT_CALLS,
}: GetAccountsTransactionsParams) => {
    const transactionHashes = await getAccountsHashes({
        web3,
        address,
        accounts,
        signatures,
        limit,
    });

    var pendingTransactions: string[] = [];
    transactionHashes.map(a => [...pendingTransactions, ...a.hashes]);
    const detailsTransactions = await getTransactions({
        pendingTransactions,
        web3,
    });
    var hashes: Record<string, HashesDetails> = {};
    transactionHashes.map(accountHashes => {
        accountHashes.hashes.map(hash => {
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
export const getAccountsTransactionsHashes = async ({
    web3,
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
        mint: 'solana',
        address: address,
    });
    const pagination = {};
    var result: any[] = [];
    for (let i = 0; i < acc_array.length; i += LIMIT_BATCH) {
        const addresses = acc_array.slice(i, i + LIMIT_BATCH);
        const resultBatchs = await getBatchAddressesWithPagination({
            web3,
            addresses,
            signatures: signatures ?? {},
            pagination,
            limit: limit as number,
        });
        result = [...result, ...resultBatchs];
    }
    return result;
};

const getBatchAddressesWithPagination = async ({
    web3,
    addresses,
    signatures,
    pagination,
    limit,
}: GetBatchAddressesWithPaginationParams) => {
    const batchResults = await getBatchAddresses({
        web3,
        addresses,
        signatures,
        pagination,
        limit,
    });
    await sleep(SLEEP_BETWEEN_CALLS);
    const resultBatchs = batchResults.map((a, index) => {
        return {
            ...addresses[index],
            result: a.map(b => b.signature),
        };
    });
    var needRecall = false;
    for (var p = 0; p < resultBatchs.length; p++) {
        const address = resultBatchs[p].address;
        if (resultBatchs[p].result.length == LIMIT_CALLS) {
            pagination[address] = resultBatchs[p].result[LIMIT_CALLS - 1];
            needRecall = true;
        } else {
            if (pagination[address] != undefined) delete pagination[address];
            addresses = addresses.filter(a => address != a.address);
        }
    }
    if (needRecall) {
        const resultBatchsAux = await getBatchAddressesWithPagination({
            web3,
            addresses,
            signatures,
            pagination,
            limit,
        });
        for (var i = 0; i < resultBatchsAux.length; i++) {
            for (var j = 0; j < resultBatchs.length; j++) {
                if (resultBatchs[j].address == resultBatchsAux[i].address) {
                    resultBatchs[j].result = [
                        ...resultBatchs[j].result,
                        ...resultBatchsAux[i].result,
                    ];
                    break;
                }
            }
        }
    }

    return resultBatchs;
};
const getBatchAddresses = async ({
    web3,
    addresses,
    signatures,
    pagination,
    limit,
}: GetBatchAddressesWithPaginationParams): Promise<ResultSignature[][]> => {
    const batch = addresses.map(({ address }) => {
        const data: PaginationData = { limit };
        if (pagination[address]) data.before = pagination[address];
        if (signatures[address]) data.until = signatures[address];
        const args = web3._buildArgsAtLeastConfirmed(
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

    const unsafeRes = await web3._rpcBatchRequest(batch);
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
