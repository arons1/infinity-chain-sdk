import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/evm/builder';
import { web3Matic } from '../../utils';
import { estimateFee } from '../../../lib/commonjs/networks/evm/estimateFee';
import {
    getAccountBalances,
    getBalance,
} from '../../../lib/commonjs/networks/evm/getBalance';
import {
    Chains,
    getPrivateAddress,
    getPublicAddress,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';
import {
    getRootNode,
    getPrivateMasterKey,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1';
import networks from '@infinity/core-sdk/lib/commonjs/networks/networks';
import {
    CoinIds,
    Coins,
    Protocol,
} from '@infinity/core-sdk/lib/commonjs/networks/registry';
const PRIORITY_FEES = {
    [Chains.ETH]: '1000000000',
    [Chains.MATIC]: '21000000000',
};
const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('networksEVM', () => {
    test('builder', async () => {
        const rootNode = getRootNode({
            mnemonic,
            network: networks[Coins.ETH],
        });
        const privateAccountNode = getPrivateMasterKey({
            bipIdCoin: CoinIds.ETH,
            protocol: Protocol.LEGACY,
            rootNode,
            walletAccount:0
        });
        const publicAddress = getPublicAddress({
            change: 0,
            index: 0,
            publicAccountNode: privateAccountNode,
        });
        const privateKey = getPrivateAddress({
            change: 0,
            index: 0,
            privateAccountNode,
        });
        const built = await buildTransaction({
            connector: web3Matic,
            chainId: Chains.MATIC,
            destination: '0xE7A38be77db0fEc3cff01c01838508201BCB5a07',
            source: publicAddress as string,
            priorityFee: PRIORITY_FEES[Chains.MATIC],
            value: '100000',
            privateKey,
        });
        expect(built.length > 0).toBe(true);
    });
    test('estimateFee', async () => {
        const built = await estimateFee({
            connector: web3Matic,
            chainId: Chains.MATIC,
            destination: '0xE7A38be77db0fEc3cff01c01838508201BCB5a07',
            source: '0xfF8996c5961D138bd01a75c2DDa2d6944658F685',
            tokenContract: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            feeRatio: 0.5,
            priorityFee: PRIORITY_FEES[Chains.MATIC],
            value: '100000',
        });
        expect(built.transaction?.data).toBe(
            '0xa9059cbb000000000000000000000000e7a38be77db0fec3cff01c01838508201bcb5a0700000000000000000000000000000000000000000000000000000000000186a0',
        );
    });
    test('getBalance', async () => {
        const bal = await getBalance({
            address: '0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f',
            connector: web3Matic,
        });
        expect(bal.balance).toBe('0');
    });
    test('getAccountBalances', async () => {
        const bal = await getAccountBalances({
            accounts: ['0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f'],
            connector: web3Matic,
            contracts: ['0x5fe2b58c013d7601147dcdd68c143a77499f5531', 'native'],
        });
        expect(
            bal['0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f'].find(
                (a: any) =>
                    a.address == '0x5fe2b58c013d7601147dcdd68c143a77499f5531',
            )?.value,
        ).toBe('255945616675368817');
        expect(
            bal['0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f'].find(
                (a: any) => a.address == 'native',
            )?.value,
        ).toBe('0');
    });
});
