import { SendTransactionParams } from './types';
/*
sendTransaction
    Returns transaction hash
    @param connector: trezorWebsocket object
    @param rawTransaction: string raw transaction
*/
export const sendTransaction = ({
    connector,
    rawTransaction,
}: SendTransactionParams): Promise<string> => {
    return new Promise((resolve, reject) => {
        connector.send(
            'sendTransaction',
            {
                hex: rawTransaction,
            },
            async (result: any) => {
                if (result?.result != undefined) resolve(result.result);
                else reject();
            },
        );
    });
};
