import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import XRPWallet from '../../../lib/commonjs/core/wallets/xrp/index';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('coreXRP', () => {
    test('init', async () => {
        const matic = new XRPWallet(Coins.XRP, mnemonic, 'my_wallet',0);
        const address = matic.getReceiveAddress({walletName:'my_wallet',walletAccount:0});

        expect(address).toBe('rMmewYFjHmtrVo8Fjrfb1eJJnVAsMR5KPL');
    });
    test('getTransactions', async () => {
        const matic = new XRPWallet(Coins.XRP, mnemonic, 'my_wallet',0);
        const transactions = await matic.getTransactions({walletName:'my_wallet',walletAccount:0});
        expect(transactions.length > 0).toBe(false);
    });
});
