export const getMinimumBalanceForRent = async (web3:any,isToken:boolean) => {
    try{
        return await web3.getMinimumBalanceForRentExemption(isToken ? 165 : 0)
    }
    catch(e){
        return isToken ? 2039280 : 890880
    }
    
}