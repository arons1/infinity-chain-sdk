import {
    BalanceResult,
    CurrencyBalanceResult,
    EstimateFeeResult,
} from '../../../networks/types';
import {
    TrezorWebsocket,
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    sendTransaction,
} from '../../../networks/utxo';
import {
    Account,
    BuildTransactionResult,
} from '../../../networks/utxo/builder/types';
import { GetAccountBalancesParams } from '../../../networks/utxo/getBalance/types';
import { SendTransactionParams } from '../../../networks/utxo/sendTransaction/types';
import CoinWallet from '../../wallet';
import { getUTXO } from '../../../networks/utxo/getUTXO/index';
import {
    GetUTXOParams,
    UTXOResult,
} from '../../../networks/utxo/getUTXO/types';
import { getLastChangeIndex } from '../../../networks/utxo/getLastChangeIndex/index';
import {
    ChangeIndexResolve,
    LastChangeIndexParameters,
} from '../../../networks/utxo/getLastChangeIndex/types';
import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import { GetChangeAddressParams } from '../../types';
import { BuildParameters, EstimateFeeParams } from './types';

class UTXOWallet extends CoinWallet {
    connector!:TrezorWebsocket;
    estimateFee(_props: EstimateFeeParams): Promise<EstimateFeeResult> {
        return estimateFee({
            ..._props,
            connector: this.connector,
            coinId:this.id
        });
    }
    buildTransaction(_props: BuildParameters): Promise<BuildTransactionResult> {
        // TODO: Generate the accounts
        const accounts:Account[] = []
        return buildTransaction({
            ..._props,
            connector: this.connector,
            accounts
        });
    }
    getBalance(
        _props: GetAccountBalancesParams,
    ): Promise<CurrencyBalanceResult> {
        return getBalance(_props);
    }
    getAccountBalances(
        _props: GetAccountBalancesParams,
    ): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances(_props);
    }
    sendTransaction(_props: SendTransactionParams): Promise<string> {
        return sendTransaction(_props);
    }
    getUTXO(_props: GetUTXOParams): Promise<UTXOResult[]> {
        return getUTXO(_props);
    }
    getLastChangeIndex(
        _props: LastChangeIndexParameters,
    ): Promise<ChangeIndexResolve> {
        return getLastChangeIndex(_props);
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector() {
        this.connector = new TrezorWebsocket(this.id);
        this.connector.connect()
    }

    getChangeAddress(_props: GetChangeAddressParams): string {
        throw new Error(NotImplemented);
    }
}

export default UTXOWallet;
