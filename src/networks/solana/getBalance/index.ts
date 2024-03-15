import { PublicKey } from "@solana/web3.js"

export const getBalance = async ({web3,address}:{web3:any,address:string}) => {
    return await web3.getBalance(new PublicKey(address))
}
export * from './tokens'