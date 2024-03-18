import axios, { AxiosResponse } from "axios"
import { FIOBalanceResponse } from "./type"

export const getBalance = (address:string) => {
    return new Promise((resolve,reject)=>{
        axios.post("https://fio.blockpane.com/v1/chain/get_fio_balance",{
            fio_public_key:address
        })
        .then((a:AxiosResponse<FIOBalanceResponse>) => {
            resolve(a.data)
        })
        .catch(e => {
            console.error(e)
            reject(e)
        })
    })
    
}