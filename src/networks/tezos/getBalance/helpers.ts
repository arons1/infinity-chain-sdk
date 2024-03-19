import memoize from 'p-memoize';

import { Asset, loadContract, isTezAsset } from './tez';

export const toAsset = memoize(async (assetSlug: string): Promise<Asset> => {
    // For tezos
    if (isTezAsset(assetSlug)) return assetSlug;

    // For token
    const [tokenContractAddress, tokenIdStr = '0'] = assetSlug.split('_');
    const tokenContract = (await loadContract(tokenContractAddress)) as any;

    return {
        contract: tokenContractAddress,
        ...(tokenContract.methods.update_operators ? { id: +tokenIdStr } : {}),
    };
});
