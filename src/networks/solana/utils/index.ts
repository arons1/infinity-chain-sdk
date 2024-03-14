import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { ResultBlockHash } from "./types";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { MEMO_PROGRAM_ID } from "../constants";

export const getLastBlockhash = async (web3:any) : Promise<ResultBlockHash> => {
    return await web3.getLatestBlockhash();
}
export const checkIfAccountExists = async ({
    mintToken,
    account,
    web3
}:{
    mintToken:string;
    account:string;
    web3:any
}) : Promise<[boolean, PublicKey]> => {
    const associatedToken = await getAssociatedTokenAddress(
        new PublicKey(mintToken),
        new PublicKey(account),
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
    try{
      await getAccount(web3, associatedToken, undefined, TOKEN_PROGRAM_ID);
      return [true,associatedToken];
    }
    catch(e){
      return [false,associatedToken];
    }
  }
  export const getMinimumBalanceForRent = async (web3:any,isToken:boolean) => {
    try{
        return await web3.getMinimumBalanceForRentExemption(isToken ? 165 : 0)
    }
    catch(e){
        return isToken ? 2039280 : 890880
    }
    
}
export const memoInstruction = (memo:string) => {
  return new TransactionInstruction({
    programId: new PublicKey(MEMO_PROGRAM_ID),
    keys: [],
    data: Buffer.from(memo, 'utf8'),
})
}