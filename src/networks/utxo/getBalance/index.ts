import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { GetAccountBalancesParams, GetAccountInfoParams } from './types';
import { BalanceResult, CurrencyBalanceResult } from '../../types';
const getAccountInfo = ({
    trezorWebsocket,
    address,
}: GetAccountInfoParams): Promise<string> => {
    return new Promise((resolve, reject) => {
        trezorWebsocket
            .send('getAccountInfo', {
                descriptor: address,
                details: 'basic',
                page: 1,
                from: 1,
                to: 1,
            },(data: { balance: string; unconfirmedBalance: string }) => {
                if(!data || !data.balance){
                    reject()
                    return
                }
                const balance = new BigNumber(data.balance);
                const unconfirmed_balance = new BigNumber(
                    data.unconfirmedBalance,
                );
                resolve(balance.plus(unconfirmed_balance).toString(10));
            })
    });
};

export const getAccountBalances = async ({
    trezorWebsocket,
    extendedPublicKeys,
}: GetAccountBalancesParams): Promise<Record<string, BalanceResult[]>> => {
    const result: Record<string, BalanceResult[]> = {};
    for (let address of extendedPublicKeys) {
        const balances = await getAccountInfo({ address, trezorWebsocket });
        result[address] = [
            {
                value: balances,
            },
        ];
    }
    return result;
};

export const getBalance = async ({
    trezorWebsocket,
    extendedPublicKeys,
}: GetAccountBalancesParams): Promise<CurrencyBalanceResult> => {
    var balance = new BigNumber(0);
    for (let address of extendedPublicKeys) {
        const balances = await getAccountInfo({ address, trezorWebsocket });
        balance = balance.plus(balances);
    }
    return {
        balance: balance.toString(10),
    };
};
