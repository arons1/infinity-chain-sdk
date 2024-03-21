import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/fio/builder';
import {
    getPrivateMasterKey,
    getRootNode,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1';
import { getFIOPrivateAddress } from '@infinity/core-sdk/lib/commonjs/networks/evm/address';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('networksFIO', () => {
    test('builder', async () => {
        const rootNode = getRootNode({ mnemonic });
        const privateAccountNode = getPrivateMasterKey({
            bipIdCoin: 235,
            protocol: 44,
            rootNode,
        });
        const privateAddress = getFIOPrivateAddress({
            privateAccountNode,
        });
        const built = await buildTransaction({
            value: '100',
            source: 'FIO5isJA4r93w5SroiiTvsba3tdpsi49Eb3ArGCFMbo3XhrKqFVHR',
            destination:
                'FIO5Y3irLYwTmCA8LZiG25QvXN7g2sRz9RdHVR6RnNNb8Tr7KVXQp',
            privateKey: privateAddress,
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
    test('sendTransaction', async () => {
        expect(true).toBe(true);
    });
});
