export type GetUTXOParams = {
    extendedPublicKey: string;
    trezorWebsocket: any;
};
export type UTXOResult = {
    protocol: number;
    address: string;
    vout: string;
    value: string;
    path: string;
    txid: string;
};
