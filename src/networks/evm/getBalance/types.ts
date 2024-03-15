export type BalanceParams = {
    address: string;
    web3: any;
};
export type RPCBalancesParams = {
    web3: any;
    addresses: string[];
    contracts: string[];
};

export type BatchBalance = {
    contractAddress: string;
    address: string;
};

export type RPCBalanceResult = Record<string, Record<string, string>>;
