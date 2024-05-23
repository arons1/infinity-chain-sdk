import axios, { AxiosResponse } from 'axios';
import { FIOBalance } from './types';
import { getAddressFromAccountParametersChecker } from '../parametersChecker';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

/**
 * getAddressFromAccount
 *   get address from account
 *   @param {string} account - address from account
 * @returns {Promise<string>} address
 */
export const getAddressFromAccount = (account: string) => {
    getAddressFromAccountParametersChecker(account);
    return new Promise((resolve, reject) => {
        axios
            .post(config[Coins.FIO].rpc[0] + 'chain/get_account', {
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

            .catch(error => {
                console.error(error);
                reject();
            });
    });
};
export const convertPubKeyToAccount = async (address: string) => {
    getAddressFromAccountParametersChecker(address);
    if (address.startsWith('FIO')) return address;
    const result = await getAddressFromAccount(address);
    return result;
};
