import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";

export type GetAccountsParams = {
    web3:any;
    address:string
}

export type TokenBalancesResult = Record<string,number>
export type GetAccountsResult = {
    account: AccountInfo<ParsedAccountData>;
    pubkey: PublicKey;
}