import axios, { AxiosResponse } from "axios"
import { FeeResult } from "./types"
import { FIOSDK } from '@fioprotocol/fiosdk'

export const estimateFee = (address:string) => {
    return new Promise((resolve)=>{
        axios.post('https://fio.blockpane.com/v1/chain/get_fee',{
            "fio_public_key":address,
            "end_point":"transfer_tokens_pub_key"
          })
        .then((a:AxiosResponse<FeeResult>) => {
          if(a.data && a.data.fee){
            resolve(a.data.fee)
          }
          else{
            resolve(FIOSDK.SUFUnit * 10)
          }
        })
        .catch(()=>{
          resolve(FIOSDK.SUFUnit * 10)
        })
      })
}