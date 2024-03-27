"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/evm/builder");
const utils_1 = require("../../utils");
const estimateFee_1 = require("../../../lib/commonjs/networks/evm/estimateFee");
const getBalance_1 = require("../../../lib/commonjs/networks/evm/getBalance");
const evm_1 = require("@infinity/core-sdk/lib/commonjs/networks/evm");
const secp256k1_1 = require("@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1");
const networks_1 = __importDefault(require("@infinity/core-sdk/lib/commonjs/networks/networks"));
const registry_1 = require("@infinity/core-sdk/lib/commonjs/networks/registry");
const PRIORITY_FEES = {
    1: '1000000000',
    137: '21000000000',
};
const mnemonic = 'double enlist lobster also layer face muffin parade direct famous notice kite';
(0, globals_1.describe)('networksEVM', () => {
    (0, globals_1.test)('builder', async () => {
        const rootNode = (0, secp256k1_1.getRootNode)({
            mnemonic,
            network: networks_1.default[registry_1.Coins.ETH],
        });
        const privateAccountNode = (0, secp256k1_1.getPrivateMasterKey)({
            bipIdCoin: registry_1.CoinIds.ETH,
            protocol: registry_1.Protocol.LEGACY,
            rootNode,
        });
        const publicAddress = (0, evm_1.getPublicAddress)({
            change: 0,
            index: 0,
            publicAccountNode: privateAccountNode,
        });
        const privateKey = (0, secp256k1_1.getPrivateKey)({
            change: 0,
            index: 0,
            privateAccountNode,
        });
        const built = await (0, builder_1.buildTransaction)({
            connector: utils_1.web3Matic,
            chainId: 137,
            destination: '0xE7A38be77db0fEc3cff01c01838508201BCB5a07',
            source: publicAddress,
            priorityFee: PRIORITY_FEES[137],
            value: '100000',
            privateKey: privateKey.privateKey,
        });
        (0, globals_1.expect)(built.length > 0).toBe(true);
    });
    (0, globals_1.test)('estimateFee', async () => {
        const built = await (0, estimateFee_1.estimateFee)({
            connector: utils_1.web3Matic,
            chainId: 137,
            destination: '0xE7A38be77db0fEc3cff01c01838508201BCB5a07',
            source: '0xfF8996c5961D138bd01a75c2DDa2d6944658F685',
            tokenContract: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            feeRatio: 0.5,
            priorityFee: PRIORITY_FEES[137],
            value: '100000',
        });
        (0, globals_1.expect)(built.transaction?.data).toBe('0xa9059cbb000000000000000000000000e7a38be77db0fec3cff01c01838508201bcb5a0700000000000000000000000000000000000000000000000000000000000186a0');
    });
    (0, globals_1.test)('getBalance', async () => {
        const bal = await (0, getBalance_1.getBalance)({
            address: '0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f',
            connector: utils_1.web3Matic,
        });
        (0, globals_1.expect)(bal.balance).toBe('100366941538263892');
    });
    (0, globals_1.test)('getAccountBalances', async () => {
        const bal = await (0, getBalance_1.getAccountBalances)({
            accounts: ['0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f'],
            connector: utils_1.web3Matic,
            contracts: ['0x5fe2b58c013d7601147dcdd68c143a77499f5531', 'native'],
        });
        (0, globals_1.expect)(bal['0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f'].find((a) => a.address == '0x5fe2b58c013d7601147dcdd68c143a77499f5531')?.value).toBe('255945616675368817');
        (0, globals_1.expect)(bal['0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f'].find((a) => a.address == 'native')?.value).toBe('100366941538263892');
    });
});
