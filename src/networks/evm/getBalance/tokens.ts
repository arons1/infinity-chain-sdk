import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { RPCBalancesParams, BatchBalance, RPCBalanceResult } from './types';
import { BalanceResult } from '../../types';
import { getBalance } from '.';

const minABI = [
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
    },
];

/**
 * getAccountBalances
 * Returns balances of the token's contracts and current balance of each address passed
 * @param {Web3} connector web3 connector
 * @param {string[]} accounts addresses to get the balances of the tokens and current balance
 * @param {string[]} contracts token's contracts
 * @returns {Promise<Record<string, BalanceResult[]>>} balances of token contracts and current balance of the addresses
 */
export const getAccountBalances = async ({ connector, accounts, contracts }: RPCBalancesParams): Promise<Record<string, BalanceResult[]>> => {
    const contract = new connector.eth.Contract(minABI);
    const map: RPCBalanceResult = {};
    const batchList: BatchBalance[] = [];
    contracts.map(contractAddress => {
        accounts.map(address => {
            batchList.push({ contractAddress, address });
            map[address] = {};
        });
    });
    for (let { contractAddress, address } of batchList) {
        if (contractAddress == 'native') {
            map[address][contractAddress] = (
                await getBalance({ connector, address })
            ).balance;
        } else {
            contract.options.address = contractAddress;
            map[address][contractAddress] = await contract.methods
                .balanceOf(address)
                .call();
        }
    }
    const formattedResult: Record<string, BalanceResult[]> = {};
    for (let address in map) {
        for (let key in map[address]) {
            const balResult: BalanceResult = {
                address: key,
                value: new BigNumber(map[address][key]).toString(10),
            };
            if (!formattedResult[address]) {
                formattedResult[address] = [];
            }
            formattedResult[address].push(balResult);
        }
    }

    return formattedResult;
};
