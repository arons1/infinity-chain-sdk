import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import TezosWallet from '../../../lib/commonjs/core/wallets/tezos/index';

const mnemonic =
    'derive lab over dragon nothing pioneer until deputy inherit help next release';
describe('coreTezos', () => {
    test('init', async () => {
        const matic = new TezosWallet(Coins.TEZOS, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const address = matic.getReceiveAddress({});

        expect(address).toBe('tz1bHaVSz1e9GeRMV7MUkS5wZmMH5qf8m8Ym');
    });
    test('getTransactions', async () => {
        const matic = new TezosWallet(Coins.TEZOS, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const transactions = await matic.getTransactions({});
        expect(transactions.length > 0).toBe(false);
    });
});
