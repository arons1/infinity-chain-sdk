
export type EstimateFeeParams = {
    extendedPublicKeys: string[];
    coinId: string;
    amount: string;
    trezorWebsocket: any;
    feeRatio?:number
};

