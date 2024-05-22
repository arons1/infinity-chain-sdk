import { Coins, Protocol } from '@infinity/core-sdk/lib/commonjs/networks';

import { UTXOResult } from '../../../networks/utxo/getUTXO/types';
import { SwapHistoricalTransaction } from '../../types';
import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';

export type EstimateFeeParams = {
    amount: string;
    feeRatio?: number;
    walletAccount: number;
    walletName: string;
};
export type GetTransactionsParams = {
    walletAccount: number;
    lastBlockHeight?: string;
    walletName: string;
    swapHistorical?: SwapHistoricalTransaction[];
};
export type BuildParameters = {
    coinId: Coins;
    amount: string;
    rootNode: BIP32Interface;
    destination: string;
    memo?: string;
    walletAccount: number;
    utxos?: UTXOResult[];
    feeRatio?: number;
    changeAddressProtocol?: Protocol;
};
