import { Coins, Protocol } from '@infinity/core-sdk/lib/commonjs/networks';

import { UTXOResult } from '../../../networks/utxo/getUTXO/types';
import { SwapHistoricalTransaction } from '../../types';

export type EstimateFeeParams = {
    amount: string;
    feeRatio?: number;
    walletName?: string;
};
export type GetTransactionsParams = {
    walletName?: string;
    lastBlockHeight?: string;
    swapHistorical?: SwapHistoricalTransaction[];
};
export type BuildParameters = {
    coinId: Coins;
    amount: string;
    mnemonic: string;
    destination: string;
    memo?: string;
    utxos?: UTXOResult[];
    feeRatio?: number;
    changeAddressProtocol?: Protocol;
};
