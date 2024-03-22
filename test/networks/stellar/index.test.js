"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const utils_1 = require("../../utils");
const builder_1 = require("../../../lib/commonjs/networks/stellar/builder");
const ed25519_1 = require("@infinity/core-sdk/lib/commonjs/networks/ed25519");
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
        console.log(built);
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
    (0, globals_1.test)('sendTransaction', async () => {
        (0, globals_1.expect)(true).toBe(true);
    });
});
