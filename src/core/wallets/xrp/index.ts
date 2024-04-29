import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import {
    CurrencyBalanceResult,
    EstimateFeeResult,
} from '../../../networks/types';
import {
    buildTransaction,
    estimateFee,
    getBalance,
    sendTransaction,
} from '../../../networks/xrp';
import CoinWallet from '../../wallet';
import { XrplClient } from 'xrpl-client';
import { BuildTransactionParams } from './types';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';

class XRPWallet extends CoinWallet {
    connector!:XrplClient
    base!:ED25519Coin
    estimateFee(): EstimateFeeResult {
        return estimateFee({
            connector:this.connector
        });
    }
    buildTransaction(_props: BuildTransactionParams): Promise<string> {
        const seed = this.base.getSeed({mnemonic:_props.mnemonic})
        const keyPair = this.base.getKeyPair({seed})
        return buildTransaction({
            ..._props,
            connector:this.connector,
            keyPair
        });
    }
    getBalance(walletName?:string): Promise<CurrencyBalanceResult> {
        return getBalance({
            address:this.getReceiveAddress({walletName: walletName ?? this.walletSelected}),
            connector:this.connector
        });
    }
    sendTransaction(rawTransaction:string): Promise<string> {
        return sendTransaction({
            rawTransaction,
            connector:this.connector
        });
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector() {
        this.connector = new XrplClient(this.id);
    }
}

export default XRPWallet;
