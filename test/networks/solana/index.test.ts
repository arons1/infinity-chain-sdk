import { describe, expect, test } from '@jest/globals';
import {
    buildTransaction,
    rawTransaction,
} from '../../../lib/commonjs/networks/solana/builder';
import { web3Solana } from '../../utils';
import { estimateFee } from '../../../lib/commonjs/networks/solana/estimateFee';
import { getBalanceAfter } from '../../../lib/commonjs/networks/solana/getBalanceAfter';
import { getBalance } from '../../../lib/commonjs/networks/solana/getBalance';
import { getAccountsTransactions } from '../../../lib/commonjs/networks/solana/getTransactions';

import { BalanceResult } from '../../../lib/commonjs/networks/types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import {
    getKeyPair,
    getSeed,
} from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import { PublicKey } from '@solana/web3.js';
import { getAccountBalances } from '../../../lib/commonjs/networks/solana/getBalance/tokens';
import { getAccounts } from '../../../lib/commonjs/networks/solana/utils';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('networksSolana', () => {
    test('build', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/501'/0'/0'" });
        const built = await buildTransaction({
            memo: 'test',
            keyPair,
            destination: 'CFhmGszsmQS8gKk7bV175v5vPhaMagbSNvHiqgDkmK1S',
            value: '1000000',
            web3: web3Solana,
        });
        expect(built.length).toBeGreaterThan(0);
    });
    test('buildToken', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/501'/0'/0'" });
        const built = await buildTransaction({
            memo: 'test',
            keyPair,
            mintToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            destination: 'CFhmGszsmQS8gKk7bV175v5vPhaMagbSNvHiqgDkmK1S',
            decimalsToken: 6,
            value: '1000',
            web3: web3Solana,
        });
        expect(built.length).toBeGreaterThan(0);
    });
    test('estimateFee', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/501'/0'/0'" });
        const built = await rawTransaction({
            memo: 'test',
            publicKey: new PublicKey(keyPair.publicKey),
            destination: 'GBVrsjDxyFTfAJEvuRmJBD4r9hwBs5HGu6Y6BYDcLA7K',
            value: '1000000',
            web3: web3Solana,
        });
        const fee = await estimateFee({
            transaction: built,
            web3: web3Solana,
        });
        expect(new BigNumber(fee.fee as string).toNumber()).toBeGreaterThan(0);
    });
    test('getBalanceAfter', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/501'/0'/0'" });
        const built = await rawTransaction({
            memo: 'test',
            publicKey: new PublicKey(keyPair.publicKey),
            mintToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            destination: 'CFhmGszsmQS8gKk7bV175v5vPhaMagbSNvHiqgDkmK1S',
            decimalsToken: 6,
            value: '1000',
            web3: web3Solana,
        });
        const balancesAfter = await getBalanceAfter({
            transaction: built,
            web3: web3Solana,
            signer: new PublicKey(keyPair.publicKey).toString(),
        });
        expect(
            balancesAfter['Fhof9N6pgye6WvT2EnAHyF9WJ5J77hSxLQYEQrEU4KC1']
                .amount,
        ).toBe('5520167');
        expect(
            balancesAfter['6xR2P7Av2m6k2Dg1ZgW3kQCZLVfXt9YxYz1LdjBimD7z']
                .amount,
        ).toBe('98206');
    });

    test('getBalance', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/501'/0'/0'" });
        const balance = await getBalance({
            web3: web3Solana,
            address: new PublicKey(keyPair.publicKey).toString(),
        });
        expect(balance.balance).toBe('5525167');
    });
    test('getAccountBalances', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/501'/0'/0'" });
        const pubAddress = new PublicKey(keyPair.publicKey).toString();
        const balance = await getAccountBalances({
            web3: web3Solana,
            address: pubAddress,
        });
        expect(
            balance[pubAddress].find(
                (a: BalanceResult) => a.address == 'native',
            )?.value,
        ).toBe('5525167');
        expect(
            balance[pubAddress].find(
                (a: BalanceResult) =>
                    a.address == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            )?.value,
        ).toBe('99206');
    });
    test('getTransactions', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/501'/0'/0'" });
        const address = new PublicKey(keyPair.publicKey).toString();
        const accounts = await getAccounts({ address, web3: web3Solana });
        const transactions = await getAccountsTransactions({
            address,
            accounts,
            web3: web3Solana,
        });
        expect(
            transactions.hashes[
                '54AYtcw9mti95uzQ2pAUDCZNYpoR1HHS19TX8Dg21By4m6SpThYUX9RCquxckKs92348UbuDmkaJVCRr23VqnX29'
            ].details?.blockTime,
        ).toBe(1711053522);
        expect(
            transactions.hashes[
                '5dTKE91sPpis4xVH2HLAC6UcnzConQ4LouzLB34wEQHHSthjWicZvm1GVvbbbJpZnLv74SvKTjGbcyqj32sDEy4m'
            ].details?.blockTime,
        ).toBe(1711053273);
    });
});
