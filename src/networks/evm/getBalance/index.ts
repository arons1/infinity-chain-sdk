import { BalanceParams } from "./types";

export const getBalance = async ({
    address,
    web3
}:BalanceParams) => {
    return await web3.eth.getBalance(address, 'latest')
}