import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { GetProgramAccountsFilter } from '@solana/web3.js';
import {
    GetAccountsParams,
    GetAccountsResult,
    TokenBalancesResult,
} from './types';
import { getBalance } from '../getBalance';

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
    return await web3.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: filters,
    });
};
export const getAccountBalances = ({
    web3,
    address,
}: GetAccountsParams): Promise<TokenBalancesResult> => {
    return new Promise(async (resolve, reject) => {
        try {
            const accounts = await getAccounts({ web3, address });
            const result: Record<string, number> = {};
            accounts.map(account => {
                const parsedAccountInfo = account.account.data;
                const mintAddress: string =
                    parsedAccountInfo['parsed']['info']['mint'];
                const tokenBalance: number =
                    parsedAccountInfo['parsed']['info']['tokenAmount'][
                        'uiAmount'
                    ];
                result[mintAddress] = tokenBalance;
            });
            try {
                result['0x0000000000000000000000000000000000000000'] =
                    await getBalance({ web3, address });
            } catch (e) {}
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
};
