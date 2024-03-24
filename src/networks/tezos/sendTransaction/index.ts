import { buildTransaction } from '../builder';
import { BuildTransactionParams } from '../builder/types';

export const sendTransaction = async (props: BuildTransactionParams) => {
    const built = await buildTransaction(props);
    return new Promise((resolve, reject) => {
        built.broadcast()
            .then((resultBuilt: { hash: string }) => {
                resolve(resultBuilt.hash);
            })
            .catch((e: any) => {
                console.error(e);
                reject();
            });
    });
};
