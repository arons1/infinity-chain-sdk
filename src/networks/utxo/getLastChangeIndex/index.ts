import {
    ChangeIndexResult,
    LastChangeIndexParameters,
    ChangeIndexResolve,
} from './types';
/*
getLastChangeIndex
    Returns balance addition of all extended public keys
    @param connector: trezorWebsocket object
    @param extendedPublicKeys: array extended public keys
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
                console.log(data);
                if (!data) {
                    reject();
                    return;
                }
                var changeIndex = 0;
                var protocol = 44;
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
