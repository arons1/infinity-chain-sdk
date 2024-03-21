import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/evm/builder';
import { estimateL1Cost } from '../../../lib/commonjs/networks/op/estimateFee';
import { web3Op } from '../../utils';
import { TransactionEVM } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

describe('networksOP', () => {
    test('estimateL1Cost', async () => {
        const built = await buildTransaction({
            web3: web3Op,
            chainId: 10,
            destination: '0xfF8996c5961D138bd01a75c2DDa2d6944658F685',
            source: '0xE7A38be77db0fEc3cff01c01838508201BCB5a07',
            feeRatio: 0.5,
            value: '1000000000000',
        });
        const cost = await estimateL1Cost(web3Op, built as TransactionEVM);
        expect(new BigNumber(cost).toNumber()).toBeGreaterThan(56428092841);
    });
});
