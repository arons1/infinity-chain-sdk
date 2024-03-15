import { SendTransactionParams } from "./types";

export const sendTransaction = ({ trezorWebsocket, rawTransaction }:SendTransactionParams) => {
    return new Promise(resolve => {
        trezorWebsocket.send(
            'sendTransaction',
            {
                hex:rawTransaction,
            },
            async (result: any) => {
                resolve(result);
            },
        );
    });
};
