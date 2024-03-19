import Web3 from "web3";

export type BalanceParams = {
    address: string;
    web3: Web3;
};
export type RPCBalancesParams = {
    web3: Web3;
    addresses: string[];
    contracts: string[];
};

export type BatchBalance = {
    contractAddress: string;
    address: string;
};

export type RPCBalanceResult = Record<string, Record<string, string>>;
