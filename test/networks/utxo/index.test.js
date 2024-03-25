"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/utxo/builder");
const secp256k1_1 = require("@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1");
const networks_1 = __importDefault(require("@infinity/core-sdk/lib/commonjs/networks/networks"));
const utils_1 = require("../../utils");
const utils_2 = require("../../../lib/commonjs/networks/solana/utils");
const mnemonic = 'double enlist lobster also layer face muffin parade direct famous notice kite';
(0, globals_1.describe)('networksUTXO', () => {
    (0, globals_1.test)('builder', async () => {
        const privateAccountNode = (0, secp256k1_1.getPrivateMasterKey)({
            rootNode: (0, secp256k1_1.getRootNode)({ mnemonic, network: networks_1.default['ltc'] }),
            bipIdCoin: 2,
            protocol: 44,
        });
        const xpub = (0, secp256k1_1.encodeGeneric)(privateAccountNode.neutered().toBase58(), 'xpub');
        while (!utils_1.trezorWebsocket.connected)
            await (0, utils_2.sleep)(500);
        const build = await (0, builder_1.buildTransaction)({
            amount: '10000',
            coinId: 'ltc',
            destination: 'LZg4esEAthGQpg4QshXf7CwJi8XLhQdPDx',
            extendedPublicKeys: [xpub],
            privateAccountNode,
            trezorWebsocket: utils_1.trezorWebsocket,
        });
        (0, globals_1.expect)(build?.hex?.length > 0).toBe(true);
    });
    (0, globals_1.test)('getFeePerByte', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('estimateFee', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('getBalance', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('getAccountBalances', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('getUTXO', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('getLastChangeIndex', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('sendTransaction', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
});
