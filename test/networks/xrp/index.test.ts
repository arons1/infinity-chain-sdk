import {
    getKeyPair,
    getPublicKey,
    getPublicXRPAddress,
    getSeed,
} from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/xrp/builder';
import { estimateFee } from '../../../lib/commonjs/networks/xrp/estimateFee';
//import { sendTransaction } from '../../../lib/commonjs/networks/xrp/sendTransaction';

import { apiRipple } from '../../utils';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { getBalance } from '../../../lib/commonjs/networks/xrp/getBalance';

const mnemonic =
    'raw green cereal demand genius mansion pistol couple surround divide chef shadow';
describe('networksXRP', () => {
    test('builder', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/144'/0'/0/0" });
        const publicAddress = getPublicXRPAddress({
            publicKey: getPublicKey({ keyPair, coinId: 144 }),
        });

        const built = await buildTransaction({
            from: publicAddress,
            to: 'raCRsF2Lv6xRcAxTJq55x21ms2TUNrRCCJ',
            amount: '10',
            keyPair,
            connector: apiRipple,
            memo: 'test',
        });
        expect(built.length > 0).toBe(true);
    });

    test('estimateFee', async () => {
        const fee = await estimateFee({
            connector: apiRipple,
        });

        expect(new BigNumber(fee?.fee as string).toNumber()).toBeGreaterThan(
            10,
        );
    });
    test('getBalance', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/144'/0'/0/0" });
        const publicAddress = getPublicXRPAddress({
            publicKey: getPublicKey({ keyPair, coinId: 144 }),
        });
        const balanceResult = await getBalance({
            address: publicAddress,
            connector: apiRipple,
        });
        expect(balanceResult.balance).toBe('20548051');
    });
    /*

    test('sendTransaction', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/144'/0'/0/0" });
        const publicAddress = getPublicXRPAddress({
            publicKey: getPublicKey({ keyPair, coinId: 144 }),
        });

        const rawTransaction = await buildTransaction({
            from: publicAddress,
            to: 'raCRsF2Lv6xRcAxTJq55x21ms2TUNrRCCJ',
            amount: '10',
            keyPair,
            connector: apiRipple,
            memo: 'test',
        });
        const result = await sendTransaction({
            rawTransaction,
            connector: apiRipple,
        });
        expect(result.length).toBeGreaterThan(0);
    });
    */
});
