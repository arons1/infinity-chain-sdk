import { SendTransactionParams } from './types';

export const sendTransaction = ({
    trezorWebsocket,
    rawTransaction,
}: SendTransactionParams) => {
    return new Promise((resolve,reject) => {
        trezorWebsocket.send(
            'sendTransaction',
            {
                hex: rawTransaction,
            },
            async (result: any) => {
                if(result?.result != undefined)
                    resolve(result.result);
                else
                    reject()
            },
        );
    });
};
