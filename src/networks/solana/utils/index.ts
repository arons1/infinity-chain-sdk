import { ResultBlockHash } from "./types";

export const getLastBlockhash = async (web3:any) : Promise<ResultBlockHash> => {
    return await web3.getLatestBlockhash();
}