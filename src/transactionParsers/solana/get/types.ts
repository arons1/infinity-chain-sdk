import { GetAccountsResult } from '@infinity/chain-sdk/lib/commonjs/networks/solana/utils/types';
import { Connection } from '@solana/web3.js';

export type SolanaParams = {
    signatures?: Record<string, string>;
    connector: Connection;
    address: string;
    accounts?: GetAccountsResult[];
};
