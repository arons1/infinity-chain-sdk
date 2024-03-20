import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/evm/builder';
import { web3Matic } from '../../utils';
import {
    getAccountBalances,
    getBalance,
} from '../../../lib/commonjs/networks/evm/getBalance';
const PRIORITY_FEES = {
    1: '1000000000',
    137: '21000000000',
};

describe('networksEVM', () => {
    test('builder', async () => {
        const built = await buildTransaction({
            web3: web3Matic,
            chainId: 137,
            destination: '0xE7A38be77db0fEc3cff01c01838508201BCB5a07',
            source: '0xfF8996c5961D138bd01a75c2DDa2d6944658F685',
            feeRatio: 0.5,
            priorityFee: PRIORITY_FEES[137],
            value: '1000000000000',
        });
        expect(built.maxPriorityFeePerGas).toBe('0x3331353030303030303030');
    });
    test('getBalance', async () => {
        const bal = await getBalance({
            address: '0x1402066a3392FF3EA724Ae6ee64194c5D93090DF',
            web3: web3Matic,
        });
        expect(bal.balance).toBe('11111111111111111');
    });
    test('getAccountBalances', async () => {
        const bal = await getAccountBalances({
            addresses: ['0xfF8996c5961D138bd01a75c2DDa2d6944658F685'],
            web3: web3Matic,
            contracts: ['0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'],
        });
        console.log(bal);
        expect(bal['0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063']).toBe(
            '11111111111111111',
        );
        expect(bal['native']).toBe('11111111111111111');
    });
});
