import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import XRPWallet from '../../../lib/commonjs/core/wallets/xrp/index';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('coreXRP', () => {
    test('init', async () => {
        const matic = new XRPWallet(Coins.XRP, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const address = matic.getReceiveAddress({});

        expect(address).toBe('rMmewYFjHmtrVo8Fjrfb1eJJnVAsMR5KPL');
    });
    test('getTransactions', async () => {
        const matic = new XRPWallet(Coins.XRP, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const transactions = await matic.getTransactions({});
        expect(transactions.length > 0).toBe(false);
    });
});
