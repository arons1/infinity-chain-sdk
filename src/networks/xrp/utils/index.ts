import { CannotGetAccount } from '../../../errors/networks';
import { accountExistsParamsChecker } from '../parametersChecker';
import { AccountExists } from './types';

/**
 * Checks if an account exists.
 *
 * @param {AccountExists} props - The properties for checking if an account exists.
 * @param {Connector} props.connector - The connector for sending requests.
 * @param {string} props.account - The account to check.
 * @return {Promise<boolean>} A promise that resolves to true if the account exists, false otherwise.
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
        console.error(e);
        throw new Error(CannotGetAccount);
    }
};
