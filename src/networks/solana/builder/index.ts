import {PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction} from '@solana/web3.js';
import { TransactionBuilderParams } from './types';
import { MEMO_PROGRAM_ID } from '../constants';
import { tokenTransaction } from './token';
import { currencyTransaction } from './currency';
import { getLastBlockhash } from '../utils';

export const memoInstruction = (memo:string) => {
  return new TransactionInstruction({
    programId: new PublicKey(MEMO_PROGRAM_ID),
    keys: [],
    data: Buffer.from(memo, 'utf8'),
})
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
  const {blockhash} = await getLastBlockhash(web3)
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