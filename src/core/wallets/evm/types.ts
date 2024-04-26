export type EstimateGasParams = {
    tokenContract?: string;
    destination?: string;
    value?: string;
    gasPrice?: string;
    feeRatio?: number;
    priorityFee?: string;
    approve?: boolean;
    walletName?: string;
};
export type BuildTransaction = {
    destination: string;
    value?: string;
    feeRatio?: number;
    priorityFee?: string;
    gasPrice?: string;
    privateKey: Buffer;
    tokenContract?: string;
    approve?: boolean;
    walletName?: string;
};

export type RPCBalancesParams = {
    contracts: string[];
    accounts?: string[];
};
