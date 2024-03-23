import { AccountExists } from './types';

export const accountExists = async ({ connector, account }: AccountExists) => {
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
