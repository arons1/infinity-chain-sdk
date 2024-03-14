import {PublicKey, SystemProgram, TransactionInstruction, TransactionMessage, VersionedTransaction} from '@solana/web3.js';
import {TOKEN_PROGRAM_ID,createAssociatedTokenAccountInstruction,ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getAccount, createTransferCheckedInstruction} from "@solana/spl-token";
import { AddAssociatedCreationParams, CurrencyTransactionParams, ResultBlockHash, TokenTransactionParams, TransactionBuilderParams } from './types';
import { MEMO_PROGRAM_ID } from '../constants';
import BigNumber from 'bignumber.js';
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
export const getLastBlockhash = async ({web3}:{web3:any}) : Promise<ResultBlockHash> => {
    return await web3.getLatestBlockhash();
}

export const memoInstruction = (memo:string) => {
  return new TransactionInstruction({
    programId: new PublicKey(MEMO_PROGRAM_ID),
    keys: [],
    data: Buffer.from(memo, 'utf8'),
})
}
  const tokenTransaction = async ({
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
  const currencyTransaction = async ({
    memo = '',
    keyPair,
    destination,
    amount
  }:CurrencyTransactionParams) => {
    const instructions:any = [SystemProgram.transfer({
      fromPubkey:  keyPair.publicKey,
      toPubkey:  new PublicKey(destination),
      lamports: new BigNumber(amount).toNumber(),
    })]
    if(memo && memo.length > 0){
      instructions.push(memoInstruction(memo))
    }
    return instructions
  }
  export const buildTransaction = async ({
    memo = '',
    keyPair,
    mintToken,
    decimalsToken,
    destination,
    account,
    amount,
    web3
  }:TransactionBuilderParams) => {
    var instructions:any[] = []
    const {blockhash} = await getLastBlockhash({web3})
    if(mintToken != undefined){
      instructions = await tokenTransaction({
            memo,
            keyPair,
            mintToken,
            decimalsToken:decimalsToken as number,
            destination,
            account,
            amount,
            web3
        })
    }
    else{
        instructions = await currencyTransaction({
            memo,
            amount,
            keyPair,
            destination
        })
    }
    const messageV0 = new TransactionMessage({
      payerKey: new PublicKey(account),
      recentBlockhash: blockhash,
      instructions:instructions,
    }).compileToV0Message();
    const transactionPay = new VersionedTransaction(messageV0);
    transactionPay.sign([keyPair])
    return transactionPay.serialize()
  }