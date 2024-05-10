import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import EVMWallet from '../../../lib/commonjs/core/wallets/evm';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('networksEVM', () => {
    test('init', async () => {
        const matic = new EVMWallet(Coins.MATIC, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const address = matic.getReceiveAddress({});

        expect(address).toBe('0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f');
    });
    test('getTransactions', async () => {
        const matic = new EVMWallet(Coins.MATIC, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const transactions = await matic.getTransactions({});
        expect(transactions.length > 0).toBe(true);
    });
    test('getTransactionsXDC', async () => {
        const matic = new EVMWallet(Coins.XDC, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const transactions = await matic.getTransactions({});
        expect(transactions.length > 0).toBe(true);
    });
    test('getTransactionsKCC', async () => {
        const matic = new EVMWallet(Coins.KCC, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const transactions = await matic.getTransactions({});
        expect(transactions.length > 0).toBe(false);
    });
});
