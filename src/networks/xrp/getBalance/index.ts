import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { CurrencyBalanceResult } from '../../types';
import { GetBalanceParams } from './types';
import { getBalanceParamsChecker } from '../parametersChecker';
/*
getBalance
    Returns balance
    @param connector: XRP api connector
    @param address: address to check balance from
*/
export const getBalance = async (
    props: GetBalanceParams,
): Promise<CurrencyBalanceResult> => {
    getBalanceParamsChecker(props);
    const { connector, address } = props;
    const request = {
        command: 'account_info',
        account: address,
        ledger_index: 'current',
    };
    try {
        const data = await connector.send(request, {
            timeoutSeconds: 5,
        });
        const result =
            data.error == 'actNotFound'
                ? 0
                : data.error
                  ? 0
                  : data.account_data['Balance'];
        const base = connector.getState().reserve.base as number;
        const owner = connector.getState().reserve.owner as number;
        const reserve = new BigNumber(base + owner).shiftedBy(6).toNumber();
        return {
            balance: result,
            available: new BigNumber(result).minus(reserve).toString(10),
        };
    } catch (e) {
        console.error(e);
        return {
            balance: '0',
        };
    }
};
