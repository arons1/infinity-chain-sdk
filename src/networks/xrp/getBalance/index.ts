import BigNumber from "bignumber.js";
import { CurrencyBalanceResult } from "../../types";
import { GetBalanceParams } from "./types";

export const getBalance = async ({
    api,
    address
}:GetBalanceParams) : Promise<CurrencyBalanceResult> => {
    const request = {
        command: 'account_info',
        account: address,
        ledger_index: 'current'
      }
    try{
        const data = await api.send(request,{
          timeoutSeconds:5
        })
        const result = data.error == "actNotFound" ? 0 : data.error ? 0 : data.account_data["Balance"];
        const base = api.getState().reserve.base as number
        const owner = api.getState().reserve.owner as number
        const reserve = new BigNumber(base + owner).shiftedBy(6).toNumber()
        return {
            balance:result,
            available:new BigNumber(result).minus(reserve).toString(10)
        }
      }
      catch(e){
        console.error(e)
        return {
            balance:"0"
        }
      }
}