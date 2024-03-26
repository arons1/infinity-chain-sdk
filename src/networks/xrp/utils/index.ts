import { accountExistsParamsChecker } from '../parametersChecker';
import { AccountExists } from './types';
/*
accountExists
    Returns if an account exists
    @param connector: XRP api connector
    @param account: account to check if it exists
*/
export const accountExists = async (props: AccountExists) => {
    accountExistsParamsChecker(props);
    const { connector, account } = props;
    const request = {
        command: 'account_info',
        account: account,
        ledger_index: 'current',
    };
    try {
        const data = await connector.send(request, {
            timeoutSeconds: 5,
        });
        return data.error != 'actNotFound';
    } catch (e) {
        return false;
    }
};
