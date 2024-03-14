import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createTransferCheckedInstruction } from "@solana/spl-token";
import { checkIfAccountExists } from "../accountExists";
import { AddAssociatedCreationParams, TokenTransactionParams } from "./types"
import { PublicKey } from "@solana/web3.js";
import { getMinimumBalanceForRent } from "../estimateFee";
import BigNumber from "bignumber.js";
import { memoInstruction } from ".";

export const addAssociatedCreation = async ({
    instructions,
    mintToken,
    destination,
    account,
    web3
}:AddAssociatedCreationParams) => {
    const [checkSender,associatedTokenSender] = await checkIfAccountExists({
        mintToken,account,web3
    })
    var extraFee = 0;
    var iterations = 0
    if(!checkSender){
      const inst = createAssociatedTokenAccountInstruction(
          new PublicKey(account),
          associatedTokenSender,
          new PublicKey(account),
          new PublicKey(mintToken),
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
      )
      instructions.push(inst)
      iterations+=1
    }

    const [checkReceiver,associatedTokenReceiver] = await checkIfAccountExists({
        mintToken,account,web3
    })
    if(!checkReceiver){
      const inst = createAssociatedTokenAccountInstruction(
          new PublicKey(account),
          associatedTokenReceiver,
          new PublicKey(destination),
          new PublicKey(mintToken),
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
      )
      instructions.push(inst)
      iterations+=1
    }
    if(iterations > 0){
      const resTr = await getMinimumBalanceForRent(web3,true)
      extraFee += (resTr*iterations)
    }
    return {senderTokenAccount:associatedTokenSender,receiverTokenAccount:associatedTokenReceiver,extraFee}
  }
export const tokenTransaction = async ({
    memo = '',
    keyPair,
    mintToken,
    destination,
    account,
    decimalsToken,
    amount,
    web3
  }:TokenTransactionParams) => {
    const instructions:any = []
    const {senderTokenAccount,receiverTokenAccount} = await addAssociatedCreation({
        instructions,
        mintToken,
        destination,
        account,
        web3
    })
    const transactionSpl = createTransferCheckedInstruction(
            senderTokenAccount, // from
            new PublicKey(mintToken), // mint
            receiverTokenAccount, // to
            keyPair.publicKey, // from's owner
            new BigNumber(amount).toNumber(), // amount
            decimalsToken // decimals
    )
    instructions.push(transactionSpl)
    if(memo && memo.length > 0){
      instructions.push(memoInstruction(memo))
    }
    return instructions
    
  }