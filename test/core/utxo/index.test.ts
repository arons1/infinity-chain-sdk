import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import UTXOWallet from '../../../lib/commonjs/core/wallets/utxo/index';

const mnemonic =
    'derive lab over dragon nothing pioneer until deputy inherit help next release';
describe('coreUTXO', () => {
    test('init', async () => {
        const matic = new UTXOWallet(Coins.LTC, mnemonic, 'my_wallet', 0);
        const address = matic.getReceiveAddress({
            walletName: 'my_wallet',
            walletAccount: 0,
        });

        expect(address).toBe('LNiHyZY6wstYSJnkyE8dXTCGZRuBk7526m');
    });
    test('getTransactions', async () => {
        const matic = new UTXOWallet(Coins.LTC, mnemonic, 'my_wallet', 0);
        const transactions = await matic.getTransactions({
            walletName: 'my_wallet',
            walletAccount: 0,
        });
        expect(transactions.length > 0).toBe(true);
    });
});
