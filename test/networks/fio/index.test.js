"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/fio/builder");
const estimateFee_1 = require("../../../lib/commonjs/networks/fio/estimateFee");
const getBalance_1 = require("../../../lib/commonjs/networks/fio/getBalance");
const secp256k1_1 = require("@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1");
const address_1 = require("@infinity/core-sdk/lib/commonjs/networks/evm/address");
const mnemonic = 'double enlist lobster also layer face muffin parade direct famous notice kite';
(0, globals_1.describe)('networksFIO', () => {
    (0, globals_1.test)('builder', async () => {
        const rootNode = (0, secp256k1_1.getRootNode)({ mnemonic });
        const privateAccountNode = (0, secp256k1_1.getPrivateMasterKey)({
            bipIdCoin: 235,
            protocol: 44,
            rootNode,
        });
        const privateAddress = (0, address_1.getFIOPrivateAddress)({
            privateAccountNode,
        });
        const built = await (0, builder_1.buildTransaction)({
            value: '100',
            source: 'FIO5isJA4r93w5SroiiTvsba3tdpsi49Eb3ArGCFMbo3XhrKqFVHR',
            destination: 'FIO5Y3irLYwTmCA8LZiG25QvXN7g2sRz9RdHVR6RnNNb8Tr7KVXQp',
            privateKey: privateAddress,
        });
        (0, globals_1.expect)(built.signatures.length).toBe(1);
    });
    (0, globals_1.test)('estimateFee', async () => {
        const fee = await (0, estimateFee_1.estimateFee)({
            source: 'FIO5isJA4r93w5SroiiTvsba3tdpsi49Eb3ArGCFMbo3XhrKqFVHR',
        });
        (0, globals_1.expect)(parseInt(fee.fee)).toBeGreaterThan(2000000000);
    });
    (0, globals_1.test)('getBalance', async () => {
        const bal = await (0, getBalance_1.getBalance)('FIO5isJA4r93w5SroiiTvsba3tdpsi49Eb3ArGCFMbo3XhrKqFVHR');
        (0, globals_1.expect)(bal.balance + '').toBe('3684876260');
        (0, globals_1.expect)(bal.available + '').toBe('3684876260');
    });
});
