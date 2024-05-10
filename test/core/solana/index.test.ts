import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import SolanaWallet from '../../../lib/commonjs/core/wallets/solana/index';

const mnemonic =
    'derive lab over dragon nothing pioneer until deputy inherit help next release';
describe('coreSolana', () => {
    test('init', async () => {
        const matic = new SolanaWallet(Coins.SOLANA, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const address = matic.getReceiveAddress({});

        expect(address).toBe('HSPjuCaHafg3YUfcQy3iVkLL4g639xHBC9FEiQNzmrWZ');
    });
    test('getTransactions', async () => {
        const matic = new SolanaWallet(Coins.SOLANA, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const transactions = await matic.getTransactions({});
        expect(transactions.length > 0).toBe(true);
    });
});
