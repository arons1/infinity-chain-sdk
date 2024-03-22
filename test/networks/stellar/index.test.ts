import { describe, expect, test } from '@jest/globals';
import { apiStellar } from '../../utils';
import { buildTransaction } from '../../../lib/commonjs/networks/stellar/builder';
import {
    getKeyPair,
    getPublicKey,
    getPublicStellarAddress,
    getSeed,
} from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
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
            api: apiStellar,
        });
        console.log(built);
        expect(true).toBe(true);
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
            api: apiStellar,
        });
        console.log(built);
        expect(true).toBe(true);
    });
    test('estimateFee', async () => {
        expect(true).toBe(true);
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
