import axios from "axios"

export const sendTransaction = (rawTransaction:string):Promise<string> => {
    return new Promise((resolve,reject)=>{
        axios.post("https://horizon.stellar.org/transactions",{
            body:rawTransaction,
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            }
        })
        .then(a => {
            resolve(a.data)
        })
        .catch(e => {
            reject(e)
        })
    })
}