"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/evm/builder");
const estimateFee_1 = require("../../../lib/commonjs/networks/op/estimateFee");
const utils_1 = require("../../utils");
const core_1 = require("@infinity/core-sdk/lib/commonjs/core");
const address_1 = require("@infinity/core-sdk/lib/commonjs/networks/evm/address");
const secp256k1_1 = require("@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1");
const networks_1 = __importDefault(require("@infinity/core-sdk/lib/commonjs/networks/networks"));
const registry_1 = require("@infinity/core-sdk/lib/commonjs/networks/registry");
const evm_1 = require("@infinity/core-sdk/lib/commonjs/networks/evm");
const mnemonic = 'double enlist lobster also layer face muffin parade direct famous notice kite';
(0, globals_1.describe)('networksOP', () => {
    (0, globals_1.test)('estimateL1Cost', async () => {
        const rootNode = (0, secp256k1_1.getRootNode)({
            mnemonic,
            network: networks_1.default[registry_1.Coins.ETH],
        });
        const privateAccountNode = (0, secp256k1_1.getPrivateMasterKey)({
            bipIdCoin: registry_1.CoinIds.ETH,
            protocol: registry_1.Protocol.LEGACY,
            rootNode,
            walletAccount: 0,
        });
        const publicAddress = (0, address_1.getPublicAddress)({
            change: 0,
            index: 0,
            publicAccountNode: privateAccountNode,
        });
        const privateKey = (0, evm_1.getPrivateAddress)({
            privateAccountNode,
        });
        const built = await (0, builder_1.buildTransaction)({
            connector: utils_1.web3Op,
            chainId: 10,
            privateKey,
            destination: '0xfF8996c5961D138bd01a75c2DDa2d6944658F685',
            source: publicAddress,
            feeRatio: 0.5,
            value: '100000',
        });
        const cost = await (0, estimateFee_1.estimateL1Cost)(utils_1.web3Op, built);
        (0, globals_1.expect)(new core_1.BigNumber(cost).toNumber()).toBeGreaterThan(1909947118);
    });
});
