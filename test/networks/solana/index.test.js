"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/solana/builder");
const utils_1 = require("../../utils");
const estimateFee_1 = require("../../../lib/commonjs/networks/solana/estimateFee");
const getBalanceAfter_1 = require("../../../lib/commonjs/networks/solana/getBalanceAfter");
const getBalance_1 = require("../../../lib/commonjs/networks/solana/getBalance");
const getTransactions_1 = require("../../../lib/commonjs/networks/solana/getTransactions");
const core_1 = require("@infinity/core-sdk/lib/commonjs/core");
const ed25519_1 = require("@infinity/core-sdk/lib/commonjs/networks/ed25519");
const web3_js_1 = require("@solana/web3.js");
const tokens_1 = require("../../../lib/commonjs/networks/solana/getBalance/tokens");
const utils_2 = require("../../../lib/commonjs/networks/solana/utils");
const mnemonic = 'double enlist lobster also layer face muffin parade direct famous notice kite';
(0, globals_1.describe)('networksSolana', () => {
    (0, globals_1.test)('build', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/501'/0'/0'" });
        const built = await (0, builder_1.buildTransaction)({
            memo: 'test',
            keyPair,
            destination: 'CFhmGszsmQS8gKk7bV175v5vPhaMagbSNvHiqgDkmK1S',
            value: '1000000',
            connector: utils_1.web3Solana,
        });
        (0, globals_1.expect)(built.length).toBeGreaterThan(0);
    });
    (0, globals_1.test)('buildToken', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/501'/0'/0'" });
        const built = await (0, builder_1.buildTransaction)({
            memo: 'test',
            keyPair,
            mintToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            destination: 'CFhmGszsmQS8gKk7bV175v5vPhaMagbSNvHiqgDkmK1S',
            decimalsToken: 6,
            value: '1000',
            connector: utils_1.web3Solana,
        });
        (0, globals_1.expect)(built.length).toBeGreaterThan(0);
    });
    (0, globals_1.test)('estimateFee', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/501'/0'/0'" });
        const built = await (0, builder_1.rawTransaction)({
            memo: 'test',
            publicKey: new web3_js_1.PublicKey(keyPair.publicKey),
            destination: 'GBVrsjDxyFTfAJEvuRmJBD4r9hwBs5HGu6Y6BYDcLA7K',
            value: '1000000',
            connector: utils_1.web3Solana,
        });
        const fee = await (0, estimateFee_1.estimateFee)({
            transaction: built,
            connector: utils_1.web3Solana,
        });
        (0, globals_1.expect)(new core_1.BigNumber(fee.fee).toNumber()).toBeGreaterThan(0);
    });
    (0, globals_1.test)('getBalanceAfter', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/501'/0'/0'" });
        const built = await (0, builder_1.rawTransaction)({
            memo: 'test',
            publicKey: new web3_js_1.PublicKey(keyPair.publicKey),
            mintToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            destination: 'CFhmGszsmQS8gKk7bV175v5vPhaMagbSNvHiqgDkmK1S',
            decimalsToken: 6,
            value: '1000',
            connector: utils_1.web3Solana,
        });
        const balancesAfter = await (0, getBalanceAfter_1.getBalanceAfter)({
            transaction: built,
            connector: utils_1.web3Solana,
            signer: new web3_js_1.PublicKey(keyPair.publicKey).toString(),
        });
        (0, globals_1.expect)(balancesAfter['Fhof9N6pgye6WvT2EnAHyF9WJ5J77hSxLQYEQrEU4KC1']
            .amount).toBe('5520167');
        (0, globals_1.expect)(balancesAfter['6xR2P7Av2m6k2Dg1ZgW3kQCZLVfXt9YxYz1LdjBimD7z']
            .amount).toBe('98206');
    });
    (0, globals_1.test)('getBalance', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/501'/0'/0'" });
        const balance = await (0, getBalance_1.getBalance)({
            connector: utils_1.web3Solana,
            address: new web3_js_1.PublicKey(keyPair.publicKey).toString(),
        });
        (0, globals_1.expect)(balance.balance).toBe('5525167');
    });
    (0, globals_1.test)('getAccountBalances', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/501'/0'/0'" });
        const pubAddress = new web3_js_1.PublicKey(keyPair.publicKey).toString();
        const balance = await (0, tokens_1.getAccountBalances)({
            connector: utils_1.web3Solana,
            accounts: [pubAddress],
        });
        (0, globals_1.expect)(balance[pubAddress].find((a) => a.address == 'native')?.value).toBe('5525167');
        (0, globals_1.expect)(balance[pubAddress].find((a) => a.address == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')?.value).toBe('99206');
    });
    (0, globals_1.test)('getTransactions', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({ seed, path: "m/44'/501'/0'/0'" });
        const address = new web3_js_1.PublicKey(keyPair.publicKey).toString();
        const accounts = await (0, utils_2.getAccounts)({ address, connector: utils_1.web3Solana });
        const transactions = await (0, getTransactions_1.getAccountsTransactions)({
            address,
            accounts,
            connector: utils_1.web3Solana,
        });
        console.log(transactions);
        (0, globals_1.expect)(transactions.hashes['54AYtcw9mti95uzQ2pAUDCZNYpoR1HHS19TX8Dg21By4m6SpThYUX9RCquxckKs92348UbuDmkaJVCRr23VqnX29']?.details?.blockTime).toBe(1711053522);
        (0, globals_1.expect)(transactions.hashes['5dTKE91sPpis4xVH2HLAC6UcnzConQ4LouzLB34wEQHHSthjWicZvm1GVvbbbJpZnLv74SvKTjGbcyqj32sDEy4m']?.details?.blockTime).toBe(1711053273);
    });
});
