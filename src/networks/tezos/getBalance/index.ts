import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import retry from 'async-retry';

import { Tezos, loadContract, isFA2Token } from './tez';
import { toAsset } from './helpers';
import { BalanceResult, CurrencyBalanceResult } from '../../types';
/*
getAccountBalances
    Returns get balance asset
    @param account: source account
    @param assetSlugs: assets slugs
*/
export const getAccountBalances = async ({
    account,
    assetSlugs,
}: {
    account: string;
    assetSlugs: string[];
}): Promise<Record<string, BalanceResult[]>> => {
    var result: Record<string, BalanceResult[]> = {
        [account]: [],
    };
    for (let assetSlug of assetSlugs) {
        const bal_res = await getAssetBalance({ account, assetSlug });
        result[account].push(bal_res);
    }
    return result;
};
/*
getAssetBalance
    Returns get balance asset
    @param account: source account
    @param assetSlug: asset slug
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
/*
getBalance
    Returns get balance
    @param address: source account
*/
export const getBalance = async ({
    address,
}: {
    address: string;
}): Promise<CurrencyBalanceResult> => {
    return {
        balance: (await getAssetBalance({ account: address, assetSlug: 'tez' }))
            .value,
    } as CurrencyBalanceResult;
};
