import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/evm/builder';
import { estimateL1Cost } from '../../../lib/commonjs/networks/op/estimateFee';
import { web3Op } from '../../utils';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { getPublicAddress } from '@infinity/core-sdk/lib/commonjs/networks/evm/address';
import {
    getPrivateKey,
    getPrivateMasterKey,
    getRootNode,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1';
import networks from '@infinity/core-sdk/lib/commonjs/networks/networks';
const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('networksOP', () => {
    test('estimateL1Cost', async () => {
        const rootNode = getRootNode({ mnemonic, network: networks['eth'] });
        const privateAccountNode = getPrivateMasterKey({
            bipIdCoin: 60,
            protocol: 44,
            rootNode,
        });
        const publicAddress = getPublicAddress({
            change: 0,
            index: 0,
            publicAccountNode: privateAccountNode,
        });
        const privateKey = getPrivateKey({
            change: 0,
            index: 0,
            privateAccountNode,
        });
        const built = await buildTransaction({
            connector: web3Op,
            chainId: 10,
            privateKey: privateKey.privateKey as Buffer,
            destination: '0xfF8996c5961D138bd01a75c2DDa2d6944658F685',
            source: publicAddress as string,
            feeRatio: 0.5,
            value: '100000',
        });
        const cost = await estimateL1Cost(web3Op, built);
        expect(new BigNumber(cost).toNumber()).toBeGreaterThan(1909947118);
    });
});
