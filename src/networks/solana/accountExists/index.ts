import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

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