import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import retry from 'async-retry';

import { Tezos, loadContract, isFA2Token } from './tez';
import { toAsset } from './helpers';
import { BalanceResult, CurrencyBalanceResult } from '../../types';
import { GetAccountBalancesParams, GetBalanceParams } from './types';

/**
 * Retrieves the balances of multiple assets for a given account.
 *
 * @param {GetAccountBalancesParams} params - The parameters for retrieving the account balances.
 * @param {string[]} params.accounts - The account to retrieve balances for.
 * @param {string[]} params.assetSlugs - The slugs of the assets to retrieve balances for.
 * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
 */
export const getAccountBalances = async ({
    accounts,
    assetSlugs,
}: GetAccountBalancesParams): Promise<Record<string, BalanceResult[]>> => {
    let result: Record<string, BalanceResult[]> = {};
    for (let account of accounts) {
        result = {
            [account]: [],
        };
        for (let assetSlug of assetSlugs) {
            const bal_res = await getAssetBalance({ account, assetSlug });
            result[account].push(bal_res);
        }
    }

    return result;
};
/**
 * Retrieves the balance of a specific asset for a given account.
 *
 * @param {Object} params - The parameters for retrieving the asset balance.
 * @param {string} params.account - The account to retrieve the asset balance for.
 * @param {string} params.assetSlug - The slug of the asset to retrieve the balance for.
 * @return {Promise<BalanceResult>} A promise that resolves to the asset balance.
 */
export const getAssetBalance = async ({
    account,
    assetSlug,
}: {
    account: string;
    assetSlug: string;
}): Promise<BalanceResult> => {
    const asset = await toAsset(assetSlug);

    var nat = new BigNumber(0);

    if (asset === 'tez') {
        nat = await retry(() => Tezos.tz.getBalance(account), { retries: 5 });
    } else {
        const contract = (await loadContract(asset.contract)) as any;

        if (isFA2Token(asset)) {
            try {
                const response = await retry(
                    () =>
                        contract.views
                            .balance_of([
                                { owner: account, token_id: asset.id },
                            ])
                            .read(),
                    { retries: 5 },
                );
                nat = response[0].balance;
            } catch {}
        } else {
            try {
                nat = await retry(
                    () => contract.views.getBalance(account).read(),
                    {
                        retries: 5,
                    },
                );
            } catch {}
        }

        if (nat.isNaN()) {
            nat = new BigNumber(0);
        }
    }
    if (assetSlug == 'tez')
        return {
            value: nat.toString(10),
            address: 'native',
        };
    const [tokenContractAddress, tokenIdStr = '0'] = assetSlug.split('_');
    return {
        value: nat.toString(10),
        id: parseInt(tokenIdStr),
        address: tokenContractAddress,
    };
};

/**
 * Retrieves the balance of a given address.
 *
 * @param {GetBalanceParams} address - The address to retrieve the balance from.
 * @return {Promise<CurrencyBalanceResult>} The balance of the given address.
 */
export const getBalance = async ({
    address,
}: GetBalanceParams): Promise<CurrencyBalanceResult> => {
    return {
        balance: (await getAssetBalance({ account: address, assetSlug: 'tez' }))
            .value,
    } as CurrencyBalanceResult;
};
