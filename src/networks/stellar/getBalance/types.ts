export type ResultBalance = {
    asset_type: string;
    asset_issuer: string;
    asset_code: string;
};

export type GetBalanceParams = {
    account: string;
    api: any;
};
