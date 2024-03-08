export const sendTransaction = ({
    trezorWebsocket,
    hex
}) => {
    return new Promise((resolve)=>{
           trezorWebsocket
            .send("sendTransaction",{
            hex
          },async (result: any)=>{
            resolve(result)
          })
        
      })
}