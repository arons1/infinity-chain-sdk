import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import { UTXOResult } from '../getUTXO/types';
import { TrezorWebsocket } from '../trezorWebsocket';

export type BuildParameters = {
    extendedPublicKeys: string;
    coinId: string;
    amount: string;
    trezorWebsocket: TrezorWebsocket;
    privateAccountNode: BIP32Interface;
    destination: string;
    memo: string;
    changeIndex?: number;
    utxos?: UTXOResult[];
    feeRatio: number;
};
