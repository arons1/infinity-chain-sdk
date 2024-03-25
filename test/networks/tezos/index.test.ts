import {
    getKeyPair,
    getPrivateKey,
    getPublicKey,
    getPublicTezosAddress,
    getSecretAddress,
    getSeed,
    getTezosPublicKeyHash,
} from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/tezos/builder';
import { estimateFee } from '../../../lib/commonjs/networks/tezos/estimateFee';

import { web3Tezos } from '../../utils';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import {
    getBalance,
    getAccountBalances,
} from '../../../lib/commonjs/networks/tezos/getBalance';
import { BalanceResult } from '../../../lib/commonjs/networks/types';

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
        expect(built.broadcast != undefined).toBe(true);
    });
    test('builderToken', async () => {
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
            mintToken: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
            decimalsToken: 8,
            value: '1000',
            privateKey,
            pkHash,
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
        const pkHash = getTezosPublicKeyHash({
            keyPair,
        });
        const fee = await estimateFee({
            source: publicAddress,
            destination: 'tz1VQA4RP4fLjEEMW2FR4pE9kAg5abb5h5GL',
            mintToken: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
            decimalsToken: 8,
            value: '1000',
            pkHash,
            connector: web3Tezos,
        });

        expect(new BigNumber(fee?.fee as string).toNumber()).toBeGreaterThan(
            10,
        );
    });
    test('getBalance', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = getPublicTezosAddress({
            publicKey: getPublicKey({ keyPair, coinId: 1729 }),
        });

        const balanceResult = await getBalance({
            address: publicAddress,
        });
        expect(balanceResult.balance).toBe('334081');
    });
    test('getAccountBalances', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/1729'/0'/0'" });
        const publicAddress = getPublicTezosAddress({
            publicKey: getPublicKey({ keyPair, coinId: 1729 }),
        });
        const balanceResult: Record<string, BalanceResult[]> =
            await getAccountBalances({
                account: publicAddress,
                assetSlugs: ['tez', 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn_0'],
            });
        expect(
            balanceResult[publicAddress]?.find(a => a.address == 'native')
                ?.value,
        ).toBe('334081');
        expect(
            balanceResult[publicAddress]?.find(
                a =>
                    a.address == 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn' &&
                    a.id == 0,
            )?.value,
        ).toBe('8133');
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
