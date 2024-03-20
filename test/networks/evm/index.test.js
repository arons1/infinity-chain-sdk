"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/evm/builder");
const utils_1 = require("../../utils");
const getBalance_1 = require("../../../lib/commonjs/networks/evm/getBalance");
const PRIORITY_FEES = {
    1: '1000000000',
    137: '21000000000',
};
(0, globals_1.describe)('networksEVM', () => {
    (0, globals_1.test)('builder', async () => {
        const built = await (0, builder_1.buildTransaction)({
            web3: utils_1.web3Matic,
            chainId: 137,
            destination: '0xE7A38be77db0fEc3cff01c01838508201BCB5a07',
            source: '0xfF8996c5961D138bd01a75c2DDa2d6944658F685',
            feeRatio: 0.5,
            priorityFee: PRIORITY_FEES[137],
            value: '1000000000000',
        });
        (0, globals_1.expect)(built.maxPriorityFeePerGas).toBe("0x3331353030303030303030");
    });
    (0, globals_1.test)('getBalance', async () => {
        const bal = await (0, getBalance_1.getBalance)({ address: "0x1402066a3392FF3EA724Ae6ee64194c5D93090DF", web3: utils_1.web3Matic });
        (0, globals_1.expect)(bal.balance).toBe("11111111111111111");
    });
    (0, globals_1.test)('getAccountBalances', async () => {
        const bal = await (0, getBalance_1.getAccountBalances)({ addresses: ["0xfF8996c5961D138bd01a75c2DDa2d6944658F685"], web3: utils_1.web3Matic, contracts: ["0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"] });
        console.log(bal);
        (0, globals_1.expect)(bal["0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"]).toBe("11111111111111111");
        (0, globals_1.expect)(bal["native"]).toBe("11111111111111111");
    });
});
