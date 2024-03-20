import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { GetProgramAccountsFilter } from '@solana/web3.js';
import { GetAccountsParams, GetAccountsResult } from './types';
import { getBalance } from '../getBalance';
import { BalanceResult } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

export const getAccounts = async ({
    web3,
    address,
}: GetAccountsParams): Promise<GetAccountsResult[]> => {
    const filters: GetProgramAccountsFilter[] = [
        {
            dataSize: 165,
        },
        {
            memcmp: {
                offset: 32,
                bytes: address,
            },
        },
    ];
    return (await web3.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: filters,
    })) as GetAccountsResult[];
};
export const getAccountBalances = async ({
    web3,
    address,
}: GetAccountsParams): Promise<Record<string, BalanceResult[]>> => {
    const accounts = await getAccounts({ web3, address });
    const result: Record<string, number> = {};
    accounts.map(account => {
        const parsedAccountInfo = account.account.data;
        const mintAddress: string = parsedAccountInfo['parsed']['info']['mint'];
        const tokenBalance: number =
            parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount'];
        result[mintAddress] = tokenBalance;
    });
    try {
        result['native'] = new BigNumber(
            (await getBalance({ web3, address })).balance,
        ).toNumber();
    } catch {}
    const formattedResult: Record<string, BalanceResult[]> = {};
    for (let contract in result) {
        const balResult: BalanceResult = {
            address: contract,
            value: new BigNumber(result[contract]).toString(10),
        };
        if (!formattedResult[address]) {
            formattedResult[address] = [];
        }
        formattedResult[address].push(balResult);
    }
    return formattedResult;
};
