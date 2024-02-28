import { SendTransactionParams } from "./types"

export const sendTransaction = ({web3,transaction,privateKey}:SendTransactionParams) => {
    return new Promise((resolve,reject)=>{
        web3.eth.accounts.signTransaction(transaction, privateKey).then((signed:any) => {
            web3.eth.sendSignedTransaction(signed.rawTransaction)
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
    })
    
}