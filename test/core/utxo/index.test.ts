import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import UTXOWallet from '../../../lib/commonjs/core/wallets/utxo/index';

const mnemonic =
    'derive lab over dragon nothing pioneer until deputy inherit help next release';
describe('coreUTXO', () => {
    test('init', async () => {
        const matic = new UTXOWallet(Coins.LTC, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const address = matic.getReceiveAddress({});

        expect(address).toBe('LNiHyZY6wstYSJnkyE8dXTCGZRuBk7526m');
    });
    test('getTransactions', async () => {
        const matic = new UTXOWallet(Coins.LTC, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const transactions = await matic.getTransactions({});
        expect(transactions.length > 0).toBe(true);
    });
});
