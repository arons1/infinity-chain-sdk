import {
    Connection,
    GetProgramAccountsFilter,
    PublicKey,
    TransactionInstruction,
} from '@solana/web3.js';
import { GetAccountsParams, GetAccountsResult, ResultBlockHash } from './types';
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    getAccount,
    getAssociatedTokenAddress,
} from '@solana/spl-token';
import { MEMO_PROGRAM_ID } from '../constants';

export const getLastBlockhash = async (
    connector: Connection,
): Promise<ResultBlockHash> => {
    return (await connector.getLatestBlockhash()) as ResultBlockHash;
};
export const checkIfAccountExists = async ({
    mintToken,
    publicKey,
    connector,
}: {
    mintToken: string;
    publicKey: PublicKey;
    connector: Connection;
}): Promise<[boolean, PublicKey]> => {
    const associatedToken = await getAssociatedTokenAddress(
        new PublicKey(mintToken),
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    try {
        await getAccount(
            connector,
            associatedToken,
            undefined,
            TOKEN_PROGRAM_ID,
        );
        return [true, associatedToken];
    } catch (e) {
        return [false, associatedToken];
    }
};
export const getMinimumBalanceForRent = async (
    connector: Connection,
    isToken: boolean,
) => {
    try {
        return await connector.getMinimumBalanceForRentExemption(
            isToken ? 165 : 0,
        );
    } catch (e) {
        return isToken ? 2039280 : 890880;
    }
};
export const memoInstruction = (memo: string) => {
    return new TransactionInstruction({
        programId: new PublicKey(MEMO_PROGRAM_ID),
        keys: [],
        data: Buffer.from(memo, 'utf8'),
    });
};

export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
export const getAccounts = async ({
    connector,
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
    return (await connector.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: filters,
    })) as GetAccountsResult[];
};
