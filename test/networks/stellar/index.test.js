"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const utils_1 = require("../../utils");
const builder_1 = require("../../../lib/commonjs/networks/stellar/builder");
const estimateFee_1 = require("../../../lib/commonjs/networks/stellar/estimateFee");
const getBalance_1 = require("../../../lib/commonjs/networks/stellar/getBalance");
const ed25519_1 = require("@infinity/core-sdk/lib/commonjs/networks/ed25519");
const core_1 = require("@infinity/core-sdk/lib/commonjs/core");
const mnemonic = 'double enlist lobster also layer face muffin parade direct famous notice kite';
(0, globals_1.describe)('networksStellar', () => {
    (0, globals_1.test)('builder', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/148'/0'" });
        const publicAddress = (0, ed25519_1.getPublicStellarAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, coinId: 148 }),
        });
        const built = await (0, builder_1.buildTransaction)({
            memo: 'test',
            source: publicAddress,
            destination: 'GA6BGWB26N7DNX42CKUOYLLNOJR4PNH3V5U2674HG5KVYLN7W62ZAODC',
            value: '1000',
            keyPair,
            api: utils_1.apiStellar,
        });
        console.log(built);
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('builderToken', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/148'/0'" });
        const publicAddress = (0, ed25519_1.getPublicStellarAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, coinId: 148 }),
        });
        const built = await (0, builder_1.buildTransaction)({
            memo: 'test',
            source: publicAddress,
            destination: 'GA6BGWB26N7DNX42CKUOYLLNOJR4PNH3V5U2674HG5KVYLN7W62ZAODC',
            value: '1000',
            code: 'USDC',
            keyPair,
            issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
            api: utils_1.apiStellar,
        });
        (0, globals_1.expect)(built?.length).toBeGreaterThan(10);
    });
    (0, globals_1.test)('estimateFee', async () => {
        const fee = await (0, estimateFee_1.estimateFee)();
        (0, globals_1.expect)(new core_1.BigNumber(fee?.fee).toNumber()).toBeGreaterThan(10);
    });
    (0, globals_1.test)('getBalance', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/148'/0'" });
        const publicAddress = (0, ed25519_1.getPublicStellarAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, coinId: 148 }),
        });
        const balance = await (0, getBalance_1.getBalance)({
            account: publicAddress,
            api: utils_1.apiStellar,
        });
        (0, globals_1.expect)(balance.balance).toBe('39999900');
    });
    (0, globals_1.test)('getAccountBalances', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
    (0, globals_1.test)('sendTransaction', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
});
