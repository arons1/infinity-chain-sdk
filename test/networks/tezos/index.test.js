"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ed25519_1 = require("@infinity/core-sdk/lib/commonjs/networks/ed25519");
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/tezos/builder");
const estimateFee_1 = require("../../../lib/commonjs/networks/tezos/estimateFee");
const utils_1 = require("../../utils");
const core_1 = require("@infinity/core-sdk/lib/commonjs/core");
const mnemonic = 'double enlist lobster also layer face muffin parade direct famous notice kite';
(0, globals_1.describe)('networksTezos', () => {
    (0, globals_1.test)('builder', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = (0, ed25519_1.getPublicTezosAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, coinId: 1729 }),
        });
        const secretKey = (0, ed25519_1.getPrivateKey)({ keyPair });
        const privateKey = (0, ed25519_1.getSecretAddress)({ coinId: 1729, secretKey });
        const built = await (0, builder_1.buildTransaction)({
            source: publicAddress,
            destination: 'tz1VQA4RP4fLjEEMW2FR4pE9kAg5abb5h5GL',
            value: '1000',
            privateKey,
            connector: utils_1.web3Tezos,
        });
        console.log(built);
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('estimateFee', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = (0, ed25519_1.getPublicTezosAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, coinId: 1729 }),
        });
        const fee = await (0, estimateFee_1.estimateFee)({
            amount: '1000',
            from: publicAddress,
            to: 'tz1VQA4RP4fLjEEMW2FR4pE9kAg5abb5h5GL',
            connector: utils_1.web3Tezos,
        });
        (0, globals_1.expect)(new core_1.BigNumber(fee?.fee).toNumber()).toBeGreaterThan(10);
    });
    (0, globals_1.test)('getBalance', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('getAccountBalances', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('sendTransaction', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
});
