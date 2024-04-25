import CoinWallet from '../wallet';
import { EstimateGasParams } from '../../../lib/commonjs/networks/evm/estimateFee/types';
import {
    BalanceParams,
    BuildTransaction,
    RPCBalancesParams,
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    sendTransaction,
} from '../../networks/evm';
import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import { SendTransactionParams } from '../../networks/evm/sendTransaction/types';
import {
    BalanceResult,
    CurrencyBalanceResult,
    EstimateFeeResult,
} from '../../networks/types';


class EVMWallet extends CoinWallet {
    estimateFee(_props: EstimateGasParams): Promise<EstimateFeeResult> {
        return estimateFee(_props);
    }
    buildTransaction(_props: BuildTransaction): Promise<string> {
        return buildTransaction(_props);
    }
    getAccountBalances(
        _props: RPCBalancesParams,
    ): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances(_props);
    }
    getBalance(_props: BalanceParams): Promise<CurrencyBalanceResult> {
        return getBalance(_props);
    }
    sendTransaction(_props: SendTransactionParams): Promise<string> {
        return sendTransaction(_props);
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector(_props: any) {
        throw new Error(NotImplemented);
    }
}

export default EVMWallet;
