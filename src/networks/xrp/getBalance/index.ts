import { GetBalanceParams } from "./types";

export const getBalance = async ({
    api,
    address
}:GetBalanceParams) => {
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
        return {
            balance:result
        }
      }
      catch(e){
        console.error(e)
        return {
            balance:0
        }
      }
}