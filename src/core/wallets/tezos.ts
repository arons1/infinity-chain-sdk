import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import {
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    sendTransaction,
} from '../../networks/tezos';
import {
    BuildTransactionParams,
    BuildTransactionResult,
} from '../../networks/tezos/builder/types';
import { EstimateFeeParams } from '../../networks/tezos/estimateFee/types';
import {
    GetAccountBalancesParams,
    GetBalanceParams,
} from '../../networks/tezos/getBalance/types';
import {
    BalanceResult,
    CurrencyBalanceResult,
    EstimateFeeResult,
} from '../../networks/types';
import CoinWallet from '../wallet';


class TezosWallet extends CoinWallet {
    estimateFee(_props: EstimateFeeParams): Promise<EstimateFeeResult> {
        return estimateFee(_props);
    }
    buildTransaction(
        _props: BuildTransactionParams,
    ): Promise<BuildTransactionResult> {
        return buildTransaction(_props);
    }
    getBalance(_props: GetBalanceParams): Promise<CurrencyBalanceResult> {
        return getBalance(_props);
    }
    getAccountBalances(
        _props: GetAccountBalancesParams,
    ): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances(_props);
    }
    sendTransaction(_props: BuildTransactionParams): Promise<string> {
        return sendTransaction(_props);
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector(_props: any) {
        throw new Error(NotImplemented);
    }

    getPublickeyHash(): string {
        return this.account;
    }
}

export default TezosWallet;
