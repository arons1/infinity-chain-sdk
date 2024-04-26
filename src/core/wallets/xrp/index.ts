import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import { CurrencyBalanceResult, EstimateFeeResult } from '../../../networks/types';
import {
    buildTransaction,
    estimateFee,
    getBalance,
    sendTransaction,
} from '../../../networks/xrp';
import { BuildTransactionParams } from '../../../networks/xrp/builder/types';
import { EstimateFeeParams } from '../../../networks/xrp/estimateFee/types';
import { GetBalanceParams } from '../../../networks/xrp/getBalance/types';
import { SendTransactionParams } from '../../../networks/xrp/sendTransaction/types';
import CoinWallet from '../../wallet';

class XRPWallet extends CoinWallet {
    estimateFee(props: EstimateFeeParams): EstimateFeeResult {
        return estimateFee(props);
    }
    buildTransaction(_props: BuildTransactionParams): Promise<string> {
        return buildTransaction(_props);
    }
    getBalance(_props: GetBalanceParams): Promise<CurrencyBalanceResult> {
        return getBalance(_props);
    }
    sendTransaction(_props: SendTransactionParams): Promise<string> {
        return sendTransaction(_props);
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector() {
        throw new Error(NotImplemented);
    }
}

export default XRPWallet;
