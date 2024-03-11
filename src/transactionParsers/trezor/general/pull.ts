import { PROVIDER_TREZOR } from '../../../constants';
import { GeneralApiParams } from '../../types';
import {
    MissingAddress,
    MissingCoinId,
    MissingExtendedKey,
} from '../../../errors/transactionParsers';
import { CoinNotIntegrated } from '../../../errors/networks';

export const pull = ({ coinId, address, page, limit }: GeneralApiParams) => {
    if (!coinId) throw new Error(MissingCoinId);
    if (coinId != 'eth') {
        if (!address) throw new Error(MissingExtendedKey);
    } else {
        if (!address) throw new Error(MissingAddress);
    }
    const selected = PROVIDER_TREZOR[coinId as string] as string;
    if (!selected) throw new Error(CoinNotIntegrated);
    if (coinId == 'eth') {
        return {
            url:
                selected +
                '/api/v2/address/' +
                address +
                '?details=txs&page=' +
                page +
                '&pageSize=' +
                limit,
            method: 'GET',
        };
    }
    return {
        url:
            selected +
            '/api/xpub/' +
            address +
            '?details=txs&page=' +
            page +
            '&pageSize=' +
            limit,
        method: 'GET',
    };
};
