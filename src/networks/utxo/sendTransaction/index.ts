import { SendTransactionParams } from './types';

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
