import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import { UTXOResult } from '../getUTXO/types';
import { TrezorWebsocket } from '../trezorWebsocket';

export type BuildParameters = {
    coinId: string;
    amount: string;
    trezorWebsocket: TrezorWebsocket;
    accounts: Account[];
    destination: string;
    memo?: string;
    changeIndex?: number;
    utxos?: UTXOResult[];
    feeRatio?: number;
};
type Account = {
    extendedPublicKey: string;
    node: BIP32Interface;
    useAsChange: boolean;
};
