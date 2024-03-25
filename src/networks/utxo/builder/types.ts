import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import { UTXOResult } from '../getUTXO/types';
import { TrezorWebsocket } from '../trezorWebsocket';
import { FeeResult } from '../estimateFee/types';

export type BuildParameters = {
    coinId: string;
    amount: string;
    connector: TrezorWebsocket;
    accounts: Account[];
    destination: string;
    memo?: string;
    utxos?: UTXOResult[];
    feeRatio?: number;
};
type Account = {
    extendedPublicKey: string;
    node: BIP32Interface;
    useAsChange: boolean;
};
export type BuildTransactionResult = {
    feePerByte:FeeResult;
    utxos: UTXOResult[];
    hex:string;
    utxosUsed: UTXOResult[];
    transactionSize:string,
}