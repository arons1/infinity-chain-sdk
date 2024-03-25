import { describe, expect, test } from '@jest/globals';
import { apiStellar } from '../../utils';
import { buildTransaction } from '../../../lib/commonjs/networks/stellar/builder';
import { estimateFee } from '../../../lib/commonjs/networks/stellar/estimateFee';
import { getBalance } from '../../../lib/commonjs/networks/stellar/getBalance';
import { getAccountBalances } from '../../../lib/commonjs/networks/stellar/getBalance';
import { BalanceResult } from '../../../lib/commonjs/networks/types';

import {
    getKeyPair,
    getPublicKey,
    getPublicStellarAddress,
    getSeed,
} from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('networksStellar', () => {
    test('builder', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/148'/0'" });
        const publicAddress = getPublicStellarAddress({
            publicKey: getPublicKey({ keyPair, coinId: 148 }),
        });
        const built = await buildTransaction({
            memo: 'test',
            source: publicAddress,
            destination:
                'GA6BGWB26N7DNX42CKUOYLLNOJR4PNH3V5U2674HG5KVYLN7W62ZAODC',
            value: '1000',
            keyPair,
            connector: apiStellar,
        });
        expect(built?.length).toBeGreaterThan(10);
    });
    test('builderToken', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/148'/0'" });
        const publicAddress = getPublicStellarAddress({
            publicKey: getPublicKey({ keyPair, coinId: 148 }),
        });
        const built = await buildTransaction({
            memo: 'test',
            source: publicAddress,
            destination:
                'GA6BGWB26N7DNX42CKUOYLLNOJR4PNH3V5U2674HG5KVYLN7W62ZAODC',
            value: '1000',
            code: 'USDC',
            keyPair,
            issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
            connector: apiStellar,
        });
        expect(built?.length).toBeGreaterThan(10);
    });
    test('estimateFee', async () => {
        const fee = await estimateFee();
        expect(new BigNumber(fee?.fee as string).toNumber()).toBeGreaterThan(
            10,
        );
    });
    test('getBalance', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/148'/0'" });
        const publicAddress = getPublicStellarAddress({
            publicKey: getPublicKey({ keyPair, coinId: 148 }),
        });
        const balance = await getBalance({
            account: publicAddress,
            connector: apiStellar,
        });
        expect(balance.balance).toBe('39999900');
    });
    test('getAccountBalances', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/148'/0'" });
        const publicAddress = getPublicStellarAddress({
            publicKey: getPublicKey({ keyPair, coinId: 148 }),
        });
        const balance = await getAccountBalances({
            accounts: [publicAddress],
            connector: apiStellar,
        });
        expect(
            balance[publicAddress]?.find(
                (a: BalanceResult) => a.address == 'native',
            )?.value,
        ).toBe('39999900');
        expect(
            balance[publicAddress]?.find(
                (a: BalanceResult) => a.address == 'native',
            )?.freeze,
        ).toBe('15000000');
        expect(
            balance[publicAddress]?.find(
                (a: BalanceResult) =>
                    a.address ==
                        'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN' &&
                    a.code == 'USDC',
            )?.value,
        ).toBe('100000');
    });
});
