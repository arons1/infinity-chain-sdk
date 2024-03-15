import { RPCBalancesParams,BatchBalance, RPCBalanceResult } from "./types";

const minABI = [
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256"}],
      type: "function",
    },
  ];
  export const getAccountBalances = async ({
    web3,
    addresses,
    contracts
  }:RPCBalancesParams) => {
    const contract = new web3.eth.Contract(minABI)
    const map:RPCBalanceResult = {}
    const batchList:BatchBalance[] = []
    contracts.map(contractAddress => {
      addresses.map(address => {
        batchList.push({contractAddress,address})
        map[address] ={}
      })
    })
    for(let {contractAddress,address} of batchList){
    if(contractAddress == "0x0000000000000000000000000000000000000000"){
        map[address][contractAddress] =  await web3.eth.getBalance(address, 'latest')
    }
    else{
        contract.options.address = contractAddress
        map[address][contractAddress] =  await contract.methods.balanceOf(address).call()
    }
    }
    return map
  
  }