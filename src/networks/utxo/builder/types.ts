import { BIP32Interface } from '@infinity/core/bip32';
import { UTXOResult } from '../getUTXO/types';

export type BuildParameters = {
    extendedPublicKeys: string;
    coinId: string;
    amount: string;
    trezorWebsocket: any;
    privateAccountNode: BIP32Interface;
    destination: string;
    memo: string;
    changeIndex?: number;
    utxos?: UTXOResult[];
};
