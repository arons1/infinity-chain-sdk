import {
    BIP32Interface,
    Network,
} from '@infinity/core-sdk/lib/commonjs/core/bip32';
import { UTXOResult } from '../getUTXO/types';
import { TrezorWebsocket } from '../trezorWebsocket';
import { FeeResult } from '../estimateFee/types';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import { TransactionBuilder } from 'bitcoinjs-lib';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

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
export type SignTransactionUTXO = {
    utxosUsed: UTXOResult[];
    accounts: Account[];
    network: Network;
    tx: TransactionBuilder;
};

export type AddChangeAmountParameters = {
    amountLeft: BigNumber;
    feeAcc: BigNumber;
    accounts: Account[];
    feeByte: BigNumber;
    feeOutput: BigNumber;
    connector: TrezorWebsocket;
    network: Network;
    tx: TransactionBuilder;
    dust: number;
};
