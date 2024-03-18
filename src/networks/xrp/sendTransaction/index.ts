import { AnyJson } from "xrpl-client"
import { SendTransactionParams, TransactionResult, TxJson } from "./types"

export const sendTransaction = ({
    rawTransaction,
    api
}:SendTransactionParams):Promise<string> => {

      return new Promise((resolve,reject) => {
        api.send({
            command: 'submit',
            tx_blob: rawTransaction
        },{
            timeoutSeconds:5
        })
        .then((result:AnyJson) => {
            const transactionResult = result as TransactionResult
            if(transactionResult.engine_result == "tesSUCCESS" || transactionResult.engine_result == "terQUEUED"){
                const txHash = transactionResult.tx_json as TxJson
                if(txHash.hash)
                    resolve(txHash.hash)
                else
                    reject()
            }
            else{
                reject()
            }
        })
        .catch(e => {
            console.error(e)
            reject()
        })
    })
}