import axios, { AxiosResponse } from 'axios';
import { FIOBalanceResponse } from './type';
import { CurrencyBalanceResult } from '../../types';
import { getBalanceParametersChecker } from '../parametersChecker';

/* 
getBalance
    Returns fee
    @param address: address to get the balance from
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
