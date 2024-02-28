import { SendTransactionParams } from "./types"
import {signLegacyTransaction, signEIP1559Transaction} from '@infinity-core-sdk'

export const sendTransaction = ({web3,transaction,privateKey,chain}:SendTransactionParams) => {
    return new Promise((resolve,reject)=>{
        const sign = chain != 1 && chain != 137 ? signLegacyTransaction : signEIP1559Transaction
        const rawTransaction = sign({transaction,privateKey})
        web3.eth.sendSignedTransaction(rawTransaction)
        .once('transactionHash',(txid:string) => {
            resolve(txid)
        })
        .on('error', (e:any) => {
            reject(e)
        })
        .catch((e:any) => {
            reject(e)
        })
    
    })
    
}