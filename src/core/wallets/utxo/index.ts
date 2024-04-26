import {
    BalanceResult,
    CurrencyBalanceResult,
    EstimateFeeResult,
} from '../../../networks/types';
import {
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    sendTransaction,
} from '../../../networks/utxo';
import {
    BuildParameters,
    BuildTransactionResult,
} from '../../../networks/utxo/builder/types';
import { EstimateFeeParams } from '../../../networks/utxo/estimateFee/types';
import { GetAccountBalancesParams } from '../../../networks/utxo/getBalance/types';
import { SendTransactionParams } from '../../../networks/utxo/sendTransaction/types';
import CoinWallet from '../../wallet';
import { getUTXO } from '../../../networks/utxo/getUTXO/index';
import { GetUTXOParams, UTXOResult } from '../../../networks/utxo/getUTXO/types';
import { getLastChangeIndex } from '../../../networks/utxo/getLastChangeIndex/index';
import {
    ChangeIndexResolve,
    LastChangeIndexParameters,
} from '../../../networks/utxo/getLastChangeIndex/types';
import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import { GetChangeAddressParams } from '../../types';

class UTXOWallet extends CoinWallet {
    estimateFee(_props: EstimateFeeParams): Promise<EstimateFeeResult> {
        return estimateFee(_props);
    }
    buildTransaction(_props: BuildParameters): Promise<BuildTransactionResult> {
        return buildTransaction(_props);
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
        throw new Error(NotImplemented);
    }

    getChangeAddress(_props: GetChangeAddressParams): string {
        throw new Error(NotImplemented);
    }
}

export default UTXOWallet;
