import Web3 from 'web3';

export type BalanceParams = {
    address: string;
    connector: Web3;
};
export type RPCBalancesParams = {
    connector: Web3;
    accounts: string[];
    contracts: string[];
};

export type BatchBalance = {
    contractAddress: string;
    address: string;
};

export type RPCBalanceResult = Record<string, Record<string, string>>;
