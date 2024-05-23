import { CannotGetUTXO } from '../../../errors/networks';
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
                    reject(new Error(CannotGetUTXO));
                    return;
                }
                resolve(
                    data.map(b => {
                        let protocol = 44;
                        if (extendedPublicKey.startsWith('zpub')) protocol = 84;
                        if (extendedPublicKey.startsWith('ypub')) protocol = 49;
                        return {
                            ...b,
                            protocol,
                            extendedPublicKey,
                        };
                    }),
                );
            },
        );
    });
};
