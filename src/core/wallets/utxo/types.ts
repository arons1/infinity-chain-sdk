import { Coins, Protocol } from "@infinity/core-sdk/lib/commonjs/networks";

import { UTXOResult } from "../../../networks/utxo/getUTXO/types";

export type EstimateFeeParams = {
    amount: string;
    feeRatio?: number;
    walletName?:string
}

export type BuildParameters = {
    coinId: Coins;
    amount: string;
    mnemonic:string;
    destination: string;
    memo?: string;
    utxos?: UTXOResult[];
    feeRatio?: number;
    changeAddressProtocol?: Protocol
}