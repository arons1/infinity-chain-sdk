import {
    getKeyPair,
    getPrivateKey,
    getPublicKey,
    getPublicTezosAddress,
    getSecretAddress,
    getSeed,
} from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/tezos/builder';
import { estimateFee } from '../../../lib/commonjs/networks/tezos/estimateFee';

import { web3Tezos } from '../../utils';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('networksTezos', () => {
    test('builder', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = getPublicTezosAddress({
            publicKey: getPublicKey({ keyPair, coinId: 1729 }),
        });
        const secretKey = getPrivateKey({ keyPair });
        const privateKey = getSecretAddress({ coinId: 1729, secretKey });
        const built = await buildTransaction({
            source: publicAddress,
            destination: 'tz1VQA4RP4fLjEEMW2FR4pE9kAg5abb5h5GL',
            value: '1000',
            privateKey,
            connector: web3Tezos,
        });
        expect(built.broadcast != undefined).toBe(true);
    });
    test('estimateFee', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = getPublicTezosAddress({
            publicKey: getPublicKey({ keyPair, coinId: 1729 }),
        });
        const secretKey = getPrivateKey({ keyPair });
        const privateKey = getSecretAddress({ coinId: 1729, secretKey });
        const fee = await estimateFee({
            amount: '1000',
            from: publicAddress,
            to: 'tz1VQA4RP4fLjEEMW2FR4pE9kAg5abb5h5GL',
            connector: web3Tezos,
            privateKey,
        });

        expect(new BigNumber(fee?.fee as string).toNumber()).toBeGreaterThan(
            10,
        );
    });
    test('getBalance', async () => {
        expect(true).toBe(true);
    });
    test('getAccountBalances', async () => {
        expect(true).toBe(true);
    });
    test('sendTransaction', async () => {
        expect(true).toBe(true);
    });
});
