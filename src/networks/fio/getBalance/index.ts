import axios, { AxiosResponse } from 'axios';
import { FIOBalanceResponse } from './type';
import { CurrencyBalanceResult } from '../../types';
import { getBalanceParametersChecker } from '../parametersChecker';


/**
 * Retrieves the balance of the given FIO address.
 *
 * @param {string} address The FIO address to get the balance from.
 * @returns {Promise<CurrencyBalanceResult>} The FIO balance of the given address.
 */
export const getBalance = (address: string): Promise<CurrencyBalanceResult> => {
    getBalanceParametersChecker(address);
    return new Promise((resolve, reject) => {
        axios
            .post('https://fio.blockpane.com/v1/chain/get_fio_balance', {
                fio_public_key: address,
            })
            .then((a: AxiosResponse<FIOBalanceResponse>) => {
                resolve(a.data);
            })
            .catch(e => {
                console.error(e);
                reject(e);
            });
    });
};
