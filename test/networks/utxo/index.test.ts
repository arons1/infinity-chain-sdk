import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/utxo/builder';
import {
    encodeGeneric,
    getPrivateMasterKey,
    getRootNode,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1';
import { connector } from '../../utils';
import { sleep } from '../../../lib/commonjs/networks/solana/utils';
import {
    estimateFee,
    getFeePerByte,
} from '../../../lib/commonjs/networks/utxo/estimateFee/index';
import {
    getAccountBalances,
    getBalance,
} from '../../../lib/commonjs/networks/utxo/getBalance/index';
import { getUTXO } from '../../../lib/commonjs/networks/utxo/getUTXO';
import { getLastChangeIndex } from '../../../lib/commonjs/networks/utxo/getLastChangeIndex';
//import { sendTransaction } from '../../../lib/commonjs/networks/utxo/sendTransaction';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import {
    CoinIds,
    Coins,
    Protocol,
} from '@infinity/core-sdk/lib/commonjs/networks/registry';
import networks from '@infinity/core-sdk/lib/commonjs/networks/networks';
import { Encoding } from '@infinity/core-sdk/lib/commonjs/networks';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('networksUTXO', () => {
    test('builder', async () => {
        while (!connector.connected) {
            await sleep(500);
        }
        const privateAccountNode = getPrivateMasterKey({
            rootNode: getRootNode({ mnemonic, network: networks[Coins.LTC] }),
            bipIdCoin: CoinIds.LTC,
            protocol: Protocol.LEGACY,
        });
        const xpub = encodeGeneric(
            privateAccountNode.neutered().toBase58(),
            Encoding.LTUB,
        );
        const build = await buildTransaction({
            amount: '10000',
            coinId: Coins.LTC,
            destination: 'LZg4esEAthGQpg4QshXf7CwJi8XLhQdPDx',
            accounts: [
                {
                    node: privateAccountNode,
                    extendedPublicKey: xpub,
                    useAsChange: true,
                },
            ],
            connector,
        });
        expect(build?.hex?.length > 0).toBe(true);
    });
    test('getFeePerByte', async () => {
        while (!connector.connected) {
            console.log(connector.connected);
            await sleep(500);
        }
        const fee = await getFeePerByte({ connector });
        expect(new BigNumber(fee.low).toNumber()).toBeGreaterThan(0);
        expect(new BigNumber(fee.high).toNumber()).toBeGreaterThan(0);
    });
    test('estimateFee', async () => {
        while (!connector.connected) {
            console.log(connector.connected);
            await sleep(500);
        }
        const privateAccountNode = getPrivateMasterKey({
            rootNode: getRootNode({ mnemonic, network: networks[Coins.LTC] }),
            bipIdCoin: CoinIds.LTC,
            protocol: Protocol.LEGACY,
        });
        const xpub = encodeGeneric(
            privateAccountNode.neutered().toBase58(),
            Encoding.XPUB,
        );
        const estimate = await estimateFee({
            amount: '10000',
            coinId: Coins.LTC,
            extendedPublicKeys: [xpub],
            connector,
        });
        expect(
            new BigNumber(estimate.fee as string).toNumber(),
        ).toBeGreaterThan(0);
    });
    test('getBalance', async () => {
        while (!connector.connected) {
            console.log(connector.connected);
            await sleep(500);
        }
        const privateAccountNode = getPrivateMasterKey({
            rootNode: getRootNode({ mnemonic, network: networks[Coins.LTC] }),
            bipIdCoin: CoinIds.LTC,
            protocol: Protocol.LEGACY,
        });
        const xpub = encodeGeneric(
            privateAccountNode.neutered().toBase58(),
            Encoding.XPUB,
        );
        const balance = await getBalance({
            extendedPublicKeys: [xpub],
            connector,
        });
        expect(new BigNumber(balance.balance).toNumber()).toBeGreaterThan(-1);
    });
    test('getAccountBalances', async () => {
        while (!connector.connected) {
            console.log(connector.connected);
            await sleep(500);
        }
        const privateAccountNode = getPrivateMasterKey({
            rootNode: getRootNode({ mnemonic, network: networks[Coins.LTC] }),
            bipIdCoin: CoinIds.LTC,
            protocol: Protocol.LEGACY,
        });
        const xpub = encodeGeneric(
            privateAccountNode.neutered().toBase58(),
            Encoding.XPUB,
        );
        const balance = await getAccountBalances({
            extendedPublicKeys: [xpub],
            connector,
        });
        expect(
            new BigNumber(balance[Object.keys(balance)[0]][0].value).toNumber(),
        ).toBeGreaterThan(-1);
    });
    test('getUTXO', async () => {
        while (!connector.connected) {
            console.log(connector.connected);
            await sleep(500);
        }
        const privateAccountNode = getPrivateMasterKey({
            rootNode: getRootNode({ mnemonic, network: networks[Coins.LTC] }),
            bipIdCoin: CoinIds.LTC,
            protocol: Protocol.LEGACY,
        });
        const xpub = encodeGeneric(
            privateAccountNode.neutered().toBase58(),
            Encoding.XPUB,
        );
        const utxo = await getUTXO({
            extendedPublicKey: xpub,
            connector,
        });
        expect(utxo.length).toBeGreaterThan(-1);
    });
    test('getLastChangeIndex', async () => {
        while (!connector.connected) {
            console.log(connector.connected);
            await sleep(500);
        }
        const privateAccountNode = getPrivateMasterKey({
            rootNode: getRootNode({ mnemonic, network: networks[Coins.LTC] }),
            bipIdCoin: CoinIds.LTC,
            protocol: Protocol.LEGACY,
        });
        const xpub = encodeGeneric(
            privateAccountNode.neutered().toBase58(),
            Encoding.XPUB,
        );
        const { index, protocol } = await getLastChangeIndex({
            extendedPublicKey: xpub,
            connector,
        });
        expect(index).toBeGreaterThan(-1);
        expect(protocol).toBe(44);
    });
    /*
    test('sendTransaction', async () => {
        while (!connector.connected) {
            console.log(connector.connected);
            await sleep(500);
        }
        const privateAccountNode = getPrivateMasterKey({
            rootNode: getRootNode({ mnemonic, network: networks[Coins.LTC] }),
            bipIdCoin: CoinIds.LTC,
            protocol: Protocol.LEGACY,
        });
        const xpub = encodeGeneric(
            privateAccountNode.neutered().toBase58(),
            Encoding.XPUB,
        );
        const build = await buildTransaction({
            amount: '10000',
            coinId: Coins.LTC,
            destination: 'LZg4esEAthGQpg4QshXf7CwJi8XLhQdPDx',
            accounts: [
                {
                    node: privateAccountNode,
                    extendedPublicKey: xpub,
                    useAsChange:true
                },
            ],
            connector,
        });
        const txhash = await sendTransaction({
            connector,
            rawTransaction: build.hex,
        });
        expect(txhash.length).toBeGreaterThan(0);
    });*/
});
