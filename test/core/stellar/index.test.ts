import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import StellarWallet from '../../../lib/commonjs/core/wallets/stellar/index';

const mnemonic =
    'derive lab over dragon nothing pioneer until deputy inherit help next release';
describe('coreStellar', () => {
    test('init', async () => {
        const matic = new StellarWallet(Coins.STELLAR, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const address = matic.getReceiveAddress({});

        expect(address).toBe(
            'GCYKH5F7TTFCKPB25N6ZMA6NUYE62P4QOBZ5WCQGEAQPEZEMNW7F3TOO',
        );
    });
    test('getTransactions', async () => {
        const matic = new StellarWallet(Coins.STELLAR, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const transactions = await matic.getTransactions({});
        expect(transactions.length > 0).toBe(false);
    });
});
