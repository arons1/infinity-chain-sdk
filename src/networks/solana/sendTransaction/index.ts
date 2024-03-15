import { SendTransactionParams } from "./types"

export const sendTransaction = async ({web3,rawTransaction}:SendTransactionParams) => {
    return web3.sendRawTransaction(rawTransaction)
}