import BigNumber from 'bignumber.js';
import { GetAccountBalancesParams, GetAccountInfoParams } from './types';
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
            })
            .then((data: { balance: string; unconfirmedBalance: string }) => {
                const balance = new BigNumber(data.balance);
                const unconfirmed_balance = new BigNumber(
                    data.unconfirmedBalance,
                );
                resolve(balance.plus(unconfirmed_balance).toString(10));
            })
            .catch((e: any) => {
                console.error(e);
                reject(e);
            });
    });
};

export const getAccountBalances = async ({
    trezorWebsocket,
    extendedPublicKeys,
}: GetAccountBalancesParams) => {
    var balance = new BigNumber(0);
    for (let address of extendedPublicKeys) {
        const balances = await getAccountInfo({ address, trezorWebsocket });
        balance = balance.plus(balances);
    }
    return balance;
};
