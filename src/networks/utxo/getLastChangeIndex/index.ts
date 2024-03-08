import { ChangeIndexResult, LastChangeIndexParameters } from "./types";

export const getLastChangeIndex = async ({
    extendedPublicKey,
    trezorWebsocket
}:LastChangeIndexParameters):Promise<number> => {
    return new Promise((resolve) => {
        trezorWebsocket.send("getAccountInfo",{
            "descriptor":extendedPublicKey,
            details:"tokens"
         })
        .then((data: ChangeIndexResult[]) => {
            var changeIndex = 0;
            for(let d of data){
                if(d.transfers > 0){
                    const [index] = d.path.split('/').slice(5)
                    if(changeIndex < parseInt(index)){
                        changeIndex = parseInt(index)
                    }
                }
            }
            resolve(changeIndex)
        })
        .catch((e: any) => {
            console.error(e)
            resolve(0)
        })
    })
}