import { Connection } from '@solana/web3.js';
import { GetAccountsResult } from '../../../networks/solana/utils/types';

export type SolanaParams = {
    signatures?: Record<string, string>;
    connector: Connection;
    address: string;
    accounts?: GetAccountsResult[];
};
