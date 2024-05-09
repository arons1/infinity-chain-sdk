import {
    ChangeIndexResult,
    LastChangeIndexParameters,
    ChangeIndexResolve,
} from './types';

/**
 * Retrieves the last change index for a given extended public key and connector.
 *
 * @param {LastChangeIndexParameters} options - The options for the function.
 * @param {string} options.extendedPublicKey - The extended public key.
 * @param {TrezorWebsocket} options.connector - The trezorWebsocket object.
 * @return {Promise<ChangeIndexResolve>} A promise that resolves with the change index and protocol.
 */
export const getLastChangeIndex = async ({
    extendedPublicKey,
    connector,
}: LastChangeIndexParameters): Promise<ChangeIndexResolve> => {
    return new Promise((resolve, reject) => {
        connector.send(
            'getAccountInfo',
            {
                descriptor: extendedPublicKey,
                details: 'tokens',
            },
            (data: ChangeIndexResult) => {
                if (!data) {
                    reject();
                    return;
                }
                let changeIndex = 0;
                let protocol = 44;
                for (let d of data.tokens) {
                    if (d.transfers > 0) {
                        const [index] = d.path.split('/').slice(5);
                        if (changeIndex < parseInt(index)) {
                            changeIndex = parseInt(index);
                        }
                        const [protocolSp] = d.path.split('/').slice(1);
                        protocol = parseInt(protocolSp.replace("'", ''));
                    }
                }
                resolve({
                    index: changeIndex,
                    protocol,
                });
            },
        );
    });
};
