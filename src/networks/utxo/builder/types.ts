import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import { UTXOResult } from '../getUTXO/types';
import { TrezorWebsocket } from '../trezorWebsocket';
import { FeeResult } from '../estimateFee/types';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';

export type BuildParameters = {
    coinId: Coins;
    amount: string;
    connector: TrezorWebsocket;
    accounts: Account[];
    destination: string;
    memo?: string;
    utxos?: UTXOResult[];
    feeRatio?: number;
};
export type Account = {
    extendedPublicKey: string;
    node: BIP32Interface;
    useAsChange: boolean;
};
export type BuildTransactionResult = {
    feePerByte: FeeResult;
    utxos: UTXOResult[];
    hex: string;
    utxosUsed: UTXOResult[];
    transactionSize: string;
};
