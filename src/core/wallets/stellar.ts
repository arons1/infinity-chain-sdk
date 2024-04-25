import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import {
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    sendTransaction,
} from '../../networks/stellar';
import { BuildTransactionParams } from '../../networks/stellar/builder/types';
import {
    GetAccountBalanceParams,
    GetBalanceParams,
} from '../../networks/stellar/getBalance/types';
import {
    BalanceResult,
    CurrencyBalanceResult,
    EstimateFeeResult,
} from '../../networks/types';
import CoinWallet from '../wallet';


class StellarWallet extends CoinWallet {
    estimateFee(): Promise<EstimateFeeResult> {
        return estimateFee();
    }
    buildTransaction(_props: BuildTransactionParams): Promise<string> {
        return buildTransaction(_props);
    }
    getBalance(_props: GetBalanceParams): Promise<CurrencyBalanceResult> {
        return getBalance(_props);
    }
    getAccountBalances(
        _props: GetAccountBalanceParams,
    ): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances(_props);
    }
    sendTransaction(rawTransaction: string): Promise<string> {
        return sendTransaction(rawTransaction);
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector(_props: any) {
        throw new Error(NotImplemented);
    }
}

export default StellarWallet;
