import { CannotSendTransaction } from '../../../errors/networks';
import { buildOperations, buildTransaction } from '../builder';
import {
    BuildOperationsParams,
    BuildTransactionParams,
} from '../builder/types';

/**
 * @description Returns transaction hash of the transaction broadcasted
 * @param {string} source - source account
 * @param {string} destination - destination account
 * @param {string} pkHash - public hash of source account
 * @param {string|number|BigNumber} value - value to send
 * @param {string} [mintToken] - mint of the token to transfer (optional)
 * @param {string} [idToken] - Id of the token (optional)
 * @param {Buffer} privateKey - Private key of the account
 * @param {ContractProvider} connector - Tezos api connector
 * @param {number} [decimalsToken] - Decimals of the token to transfer (optional)
 * @param {number} [feeRatio] - Ratio of fee
 * @returns {Promise<string>} - Transaction hash of the transaction broadcasted
 */

export const sendTransaction = async (
    props: BuildTransactionParams,
): Promise<string> => {
    const built = await buildTransaction(props);
    return new Promise((resolve, reject) => {
        built
            .broadcast()
            .then((resultBuilt: { hash: string }) => {
                resolve(resultBuilt.hash);
            })
            .catch((err: any) => {
                console.error(err);
                if (err.errors) {
                    const errorTaquito = err?.errors?.[err.errors?.length - 1];
                    if (
                        errorTaquito?.id != undefined &&
                        errorTaquito.id.split('.').slice(2).join('.') !=
                            undefined
                    )
                        reject(
                            new Error(
                                errorTaquito.id.split('.').slice(2).join('.'),
                            ),
                        );
                    else reject(new Error(CannotSendTransaction));
                } else {
                    reject(new Error(CannotSendTransaction));
                }
            });
    });
};

/**
 * Build and broadcast operations transaction
 * @param {object[]} operations - Operations to build
 * @param {Buffer} privateKey - Buffer private key
 * @param {ContractProvider} connector - Tezos api connector
 * @param {string} pkHash - Public key hash
 * @param {string} source - Public address
 * @returns {Promise<string>} - Hash of the operation transaction broadcasted
 */
export const sendOperations = async (props: BuildOperationsParams) => {
    const built = await buildOperations(props);
    return new Promise((resolve, reject) => {
        built
            .broadcast()
            .then((resultBuilt: { hash: string }) => {
                resolve(resultBuilt.hash);
            })
            .catch((err: any) => {
                console.error(err);
                if (err.errors) {
                    const errorTaquito = err?.errors?.[err.errors?.length - 1];
                    if (
                        errorTaquito?.id != undefined &&
                        errorTaquito.id.split('.').slice(2).join('.') !=
                            undefined
                    )
                        reject(
                            new Error(
                                errorTaquito.id.split('.').slice(2).join('.'),
                            ),
                        );
                    else reject(new Error(CannotSendTransaction));
                } else {
                    reject(new Error(CannotSendTransaction));
                }
            });
    });
};
