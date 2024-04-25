import { buildOperations, buildTransaction } from '../builder';
import {
    BuildOperationsParams,
    BuildTransactionParams,
} from '../builder/types';
/*
sendTransaction
    Returns transaction hash of the transaction broadcasted
    @param source: source account
    @param destination: destination account
    @param pkHash: public hash of source account
    @param value: value to send
    @param mintToken: mint of the token to transfer(optional)
    @param idToken: Id of the token(optional)
    @param privateKey: Private key of the account
    @param connector: Tezos api connector
    @param decimalsToken: Decimals of the token to transfer(optional)
    @param feeRatio: Ratio of fee
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
            .catch((e: any) => {
                console.error(e);
                reject();
            });
    });
};
/*
sendOperations
    Returns hash of the operation transaction broadcasted
    @param operations: Operations to build
    @param privateKey: Buffer private key
    @param connector: Tezos api connector
    @param pkHash: public key hash
    @param source: public address
*/
export const sendOperations = async (props: BuildOperationsParams) => {
    const built = await buildOperations(props);
    return new Promise((resolve, reject) => {
        built
            .broadcast()
            .then((resultBuilt: { hash: string }) => {
                resolve(resultBuilt.hash);
            })
            .catch((e: any) => {
                console.error(e);
                reject();
            });
    });
};
