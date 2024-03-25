import { GetUTXOParams, UTXOResult } from './types';
/*
getUTXO
    Returns utxos
    @param connector: trezorWebsocket object
    @param extendedPublicKeys: array extended public keys
*/
export const getUTXO = ({
    extendedPublicKey,
    connector,
}: GetUTXOParams): Promise<UTXOResult[]> => {
    return new Promise((resolve, reject) => {
        connector.send(
            'getAccountUtxo',
            {
                descriptor: extendedPublicKey,
                page: 1,
                from: 1,
                to: 1,
            },
            (data: UTXOResult[]) => {
                if (!data) {
                    reject();
                    return;
                }
                resolve(
                    data.map(b => {
                        return {
                            ...b,
                            protocol: extendedPublicKey.startsWith('zpub')
                                ? 84
                                : extendedPublicKey.startsWith('ypub')
                                  ? 49
                                  : 44,
                            extendedPublicKey,
                        };
                    }),
                );
            },
        );
    });
};
