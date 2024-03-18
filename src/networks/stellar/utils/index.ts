import axios, { AxiosResponse } from 'axios'
import { AccountExists, AssetExistsRequest } from './types'
import StellarSdk from 'stellar-sdk';

export const assetExists = async (code:string,account:string) => {
    return new Promise((resolve) => {
        axios(`https://horizon.stellar.org/assets?asset_issuer=${account.toUpperCase()}`)
        .then((a:AxiosResponse<AssetExistsRequest>) => {
          if(a.data && a.data._embedded && a.data._embedded.records){
            resolve(a.data._embedded.records.find(b => b.asset_code.toLowerCase() == code.toLowerCase()) != undefined)
          }
          else{
            resolve(false)
          }
        })
        .catch(e => {
          resolve(false)
        })
      })
}

export const accountExists = async ({
    api,
    account
}:AccountExists) => {
    try{
        await api.loadAccount(account)
        return true;
    }
    catch(e){
        return false;
    }
}

export const makeAsset = (code?:string,issuer?:string) => {
    if(!code || !issuer)
        return StellarSdk.Asset.native()
   return new StellarSdk.Asset(code.toUpperCase(),issuer.toUpperCase())
}