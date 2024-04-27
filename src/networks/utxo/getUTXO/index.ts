import { GetUTXOParams, UTXOResult } from './types';

/**
 * Retrieves UTXO data based on the extended public key and connector.
 *
 * @param {GetUTXOParams} extendedPublicKey - The extended public key to fetch UTXO data.
 * @param {Connector} connector - The connector object to send the request.
 * @return {Promise<UTXOResult[]>} A promise that resolves with the UTXO data.
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
