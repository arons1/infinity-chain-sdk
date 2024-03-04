import { GetUTXOParams, UTXOResult } from "./types"

export const getUTXO = ({
    extendedPublicKey,
    trezorWebsocket
}:GetUTXOParams):Promise<UTXOResult[]> => {
    return new Promise((resolve,reject) => {
        trezorWebsocket.send("getAccountUtxo",{
            "descriptor":extendedPublicKey,
            page:1,
            from:1,
            to:1
         })
        .then((data: UTXOResult[]) => {
            resolve(data.map(b => {
                return {
                    ...b,
                    segwit:!extendedPublicKey.startsWith('xpub')
                }
            }))
        })
        .catch((e: any) => {
            console.error(e)
            reject(e)
        })
    })
}