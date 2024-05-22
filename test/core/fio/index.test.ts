import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import FIOWallet from '../../../lib/commonjs/core/wallets/fio/index';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('coreFIO', () => {
    test('init', async () => {
        const matic = new FIOWallet(Coins.FIO, mnemonic, 'my_wallet',0);
        const address = matic.getReceiveAddress({walletName:'my_wallet',walletAccount:0});

        expect(address).toBe(
            'FIO5isJA4r93w5SroiiTvsba3tdpsi49Eb3ArGCFMbo3XhrKqFVHR',
        );
    });
    test('getTransactions', async () => {
        const matic = new FIOWallet(Coins.FIO, mnemonic, 'my_wallet',0);
        const transactions = await matic.getTransactions({walletName:'my_wallet',walletAccount:0});
        expect(transactions.length > 0).toBe(false);
    });
});
