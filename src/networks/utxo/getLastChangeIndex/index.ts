import { ChangeIndexResult, LastChangeIndexParameters } from './types';

export const getLastChangeIndex = async ({
    extendedPublicKey,
    trezorWebsocket,
}: LastChangeIndexParameters): Promise<number> => {
    return new Promise((resolve,reject) => {
        trezorWebsocket
            .send('getAccountInfo', {
                descriptor: extendedPublicKey,
                details: 'tokens',
            },(data: ChangeIndexResult[]) => {
                if(!data){
                    reject()
                    return
                }
                var changeIndex = 0;
                for (let d of data) {
                    if (d.transfers > 0) {
                        const [index] = d.path.split('/').slice(5);
                        if (changeIndex < parseInt(index)) {
                            changeIndex = parseInt(index);
                        }
                    }
                }
                resolve(changeIndex);
            })
    });
};
