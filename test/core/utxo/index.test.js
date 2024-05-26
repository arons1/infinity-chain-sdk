"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const registry_1 = require("@infinity/core-sdk/lib/commonjs/networks/registry");
const index_1 = __importDefault(require("../../../lib/commonjs/core/wallets/utxo/index"));
const mnemonic = 'derive lab over dragon nothing pioneer until deputy inherit help next release';
(0, globals_1.describe)('coreUTXO', () => {
    (0, globals_1.test)('init', async () => {
        const matic = new index_1.default(registry_1.Coins.LTC, mnemonic, 'my_wallet', 0);
        const address = matic.getReceiveAddress({
            walletName: 'my_wallet',
            walletAccount: 0,
        });
        (0, globals_1.expect)(address).toBe('LNiHyZY6wstYSJnkyE8dXTCGZRuBk7526m');
    });
    (0, globals_1.test)('getTransactions', async () => {
        const matic = new index_1.default(registry_1.Coins.LTC, mnemonic, 'my_wallet', 0);
        const transactions = await matic.getTransactions({
            walletName: 'my_wallet',
            walletAccount: 0,
        });
        (0, globals_1.expect)(transactions.length > 0).toBe(true);
    });
});
