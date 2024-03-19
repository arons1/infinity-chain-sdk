import BigNumber from 'bignumber.js';
import { getBalance } from '.';
import { BalanceResult } from '../../types';
import { RPCBalancesParams, BatchBalance, RPCBalanceResult } from './types';

const minABI = [
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
    },
];
export const getAccountBalances = async ({
    web3,
    addresses,
    contracts,
}: RPCBalancesParams): Promise<Record<string,BalanceResult[]>> => {
    const contract = new web3.eth.Contract(minABI);
    const map: RPCBalanceResult = {};
    const batchList: BatchBalance[] = [];
    contracts.map(contractAddress => {
        addresses.map(address => {
            batchList.push({ contractAddress, address });
            map[address] = {};
        });
    });
    for (let { contractAddress, address } of batchList) {
        if (contractAddress == 'native') {
            map[address][contractAddress] = (await getBalance({ web3, address })).balance;
        } else {
            contract.options.address = contractAddress;
            map[address][contractAddress] = await contract.methods
                .balanceOf(address)
                .call();
        }
    }
    const formattedResult:Record<string,BalanceResult[]> = {}
    for(let address in map){
        for(let key in map[address]){
            const balResult:BalanceResult = {
                address:key,
                value:new BigNumber(map[address][key]).toString(10)
            }
            if(!formattedResult[address]){
                formattedResult[address] = []
            }
            formattedResult[address].push(balResult)
        }
    }
    return formattedResult;
};