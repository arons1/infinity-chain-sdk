import axios, { AxiosResponse } from 'axios';
import { FIOBalance } from './types';

/* 
getAddressFromAccount
    get address from account
    @param account: address from account
*/
export const getAddressFromAccount = (account: string) => {
    return new Promise(function (resolve, reject) {
        axios
            .post('https://fio.blockpane.com/v1/chain/get_account', {
                account_name: account,
            })
            .then((a: AxiosResponse<FIOBalance>) => {
                if (
                    a.data.permissions &&
                    a.data.permissions.filter(a => a.perm_name == 'owner')
                        .length > 0
                ) {
                    resolve(
                        a.data.permissions.filter(
                            a => a.perm_name == 'owner',
                        )[0].required_auth.keys[0].key,
                    );
                } else {
                    reject();
                }
            })

            .catch(() => {
                reject();
            });
    });
};
export const convertPubKeyToAccount = async (address: string) => {
    if (address.startsWith('FIO')) return address;
    const result = await getAddressFromAccount(address);
    return result;
};
