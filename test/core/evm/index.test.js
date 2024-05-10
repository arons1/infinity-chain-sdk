"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const registry_1 = require("@infinity/core-sdk/lib/commonjs/networks/registry");
const evm_1 = __importDefault(require("../../../lib/commonjs/core/wallets/evm"));
const mnemonic = 'double enlist lobster also layer face muffin parade direct famous notice kite';
(0, globals_1.describe)('networksEVM', () => {
    (0, globals_1.test)('init', async () => {
        const matic = new evm_1.default(registry_1.Coins.MATIC, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const address = matic.getReceiveAddress({});
        (0, globals_1.expect)(address).toBe('0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f');
    });
    (0, globals_1.test)('getTransactions', async () => {
        const matic = new evm_1.default(registry_1.Coins.MATIC, mnemonic, 'my_wallet');
        matic.selectWallet('my_wallet');
        const transactions = await matic.getTransactions({});
        console.log(transactions);
        (0, globals_1.expect)(transactions.length > 0).toBe(true);
    });
});
