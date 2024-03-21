import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/evm/builder';
import { web3Op } from 'utils';

describe('networksOP', () => {
    test('estimateFee', async () => {
        const built = await buildTransaction({
            web3: web3Op,
            chainId: 10,
            destination: '0xE7A38be77db0fEc3cff01c01838508201BCB5a07',
            source: '0xfF8996c5961D138bd01a75c2DDa2d6944658F685',
            feeRatio: 0.5,
            value: '1000000000000',
        });
        expect(true).toBe(true);
    });
});
