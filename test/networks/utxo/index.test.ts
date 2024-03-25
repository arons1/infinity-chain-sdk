import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/utxo/builder';
import {
    encodeGeneric,
    getPrivateMasterKey,
    getRootNode,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1';
import networks from '@infinity/core-sdk/lib/commonjs/networks/networks';
import { trezorWebsocket } from '../../utils';
import { sleep } from '../../../lib/commonjs/networks/solana/utils';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('networksUTXO', () => {
    test('builder', async () => {
        const privateAccountNode = getPrivateMasterKey({
            rootNode: getRootNode({ mnemonic, network: networks['ltc'] }),
            bipIdCoin: 2,
            protocol: 44,
        });
        const xpub = encodeGeneric(
            privateAccountNode.neutered().toBase58(),
            'xpub',
        );
        while (!trezorWebsocket.connected) await sleep(500);
        const build = await buildTransaction({
            amount: '10000',
            coinId: 'ltc',
            destination: 'LZg4esEAthGQpg4QshXf7CwJi8XLhQdPDx',
            extendedPublicKeys: [xpub],
            privateAccountNode,
            trezorWebsocket,
        });
        expect(build?.hex?.length > 0).toBe(true);
    });
    test('getFeePerByte', async () => {
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
    test('getUTXO', async () => {
        expect(true).toBe(true);
    });
    test('getLastChangeIndex', async () => {
        expect(true).toBe(true);
    });
    test('sendTransaction', async () => {
        expect(true).toBe(true);
    });
});
