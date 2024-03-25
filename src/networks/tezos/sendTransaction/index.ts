import { buildOperations, buildTransaction } from '../builder';
import {
    BuildOperationsParams,
    BuildTransactionParams,
} from '../builder/types';

export const sendTransaction = async (props: BuildTransactionParams) => {
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
