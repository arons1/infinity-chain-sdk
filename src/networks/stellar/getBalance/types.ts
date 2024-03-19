export type ResultBalanceRPC = {
    asset_type: string;
    asset_issuer: string;
    asset_code: string;
    balance: string;
};

export type GetBalanceParams = {
    account: string;
    api: any;
};
