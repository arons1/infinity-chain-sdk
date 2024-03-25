"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ed25519_1 = require("@infinity/core-sdk/lib/commonjs/networks/ed25519");
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/tezos/builder");
const estimateFee_1 = require("../../../lib/commonjs/networks/tezos/estimateFee");
const utils_1 = require("../../utils");
const core_1 = require("@infinity/core-sdk/lib/commonjs/core");
const getBalance_1 = require("../../../lib/commonjs/networks/tezos/getBalance");
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
        const pkHash = (0, ed25519_1.getTezosPublicKeyHash)({
            keyPair,
        });
        const built = await (0, builder_1.buildTransaction)({
            source: publicAddress,
            destination: 'tz1VQA4RP4fLjEEMW2FR4pE9kAg5abb5h5GL',
            value: '1000',
            pkHash,
            privateKey,
            connector: utils_1.web3Tezos,
        });
        (0, globals_1.expect)(built.broadcast != undefined).toBe(true);
    });
    (0, globals_1.test)('builderToken', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = (0, ed25519_1.getPublicTezosAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, coinId: 1729 }),
        });
        const secretKey = (0, ed25519_1.getPrivateKey)({ keyPair });
        const privateKey = (0, ed25519_1.getSecretAddress)({ coinId: 1729, secretKey });
        const pkHash = (0, ed25519_1.getTezosPublicKeyHash)({
            keyPair,
        });
        const built = await (0, builder_1.buildTransaction)({
            source: publicAddress,
            destination: 'tz1VQA4RP4fLjEEMW2FR4pE9kAg5abb5h5GL',
            mintToken: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
            decimalsToken: 8,
            value: '1000',
            privateKey,
            pkHash,
            connector: utils_1.web3Tezos,
        });
        (0, globals_1.expect)(built.broadcast != undefined).toBe(true);
    });
    (0, globals_1.test)('estimateFee', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = (0, ed25519_1.getPublicTezosAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, coinId: 1729 }),
        });
        const pkHash = (0, ed25519_1.getTezosPublicKeyHash)({
            keyPair,
        });
        const fee = await (0, estimateFee_1.estimateFee)({
            source: publicAddress,
            destination: 'tz1VQA4RP4fLjEEMW2FR4pE9kAg5abb5h5GL',
            mintToken: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
            decimalsToken: 8,
            value: '1000',
            pkHash,
            connector: utils_1.web3Tezos,
        });
        (0, globals_1.expect)(new core_1.BigNumber(fee?.fee).toNumber()).toBeGreaterThan(10);
    });
    (0, globals_1.test)('getBalance', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = (0, ed25519_1.getPublicTezosAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, coinId: 1729 }),
        });
        const balanceResult = await (0, getBalance_1.getBalance)({
            address: publicAddress,
        });
        (0, globals_1.expect)(balanceResult.balance).toBe('334081');
    });
    (0, globals_1.test)('getAccountBalances', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = (0, ed25519_1.getPublicTezosAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, coinId: 1729 }),
        });
        const balanceResult = await (0, getBalance_1.getAccountBalances)({
            account: publicAddress,
            assetSlugs: ['tez', 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn_0'],
        });
        (0, globals_1.expect)(balanceResult[publicAddress]?.find(a => a.address == 'native')
            ?.value).toBe('334081');
        (0, globals_1.expect)(balanceResult[publicAddress]?.find(a => a.address == 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn' &&
            a.id == 0)?.value).toBe('8133');
    });
    /*
    test('sendTransaction', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = getPublicTezosAddress({
            publicKey: getPublicKey({ keyPair, coinId: 1729 }),
        });
        const secretKey = getPrivateKey({ keyPair });
        const privateKey = getSecretAddress({ coinId: 1729, secretKey });
        const pkHash = getTezosPublicKeyHash({
            keyPair,
        });
        const built = await buildTransaction({
            source: publicAddress,
            destination: 'tz1VQA4RP4fLjEEMW2FR4pE9kAg5abb5h5GL',
            value: '1000',
            pkHash,
            privateKey,
            connector: web3Tezos,
        });
        const result = await built.broadcast();
        expect(result?.hash?.length > 0).toBe(true);
    });*/
});
