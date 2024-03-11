import { UTXOResult } from '../getUTXO/types';

export type EstimateFeeParams = {
    extendedPublicKeys: string[];
    coinId: string;
    amount: string;
    trezorWebsocket: any;
};

export type EstimateFeeResult = {
    feePerByte: {
        low: string;
        high: string;
    };
    utxos: UTXOResult[];
    utxosUsed: UTXOResult[];
    transactionSize: string;
};
