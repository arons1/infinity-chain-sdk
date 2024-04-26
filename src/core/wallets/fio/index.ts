import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import {
    buildTransaction,
    estimateFee,
    getBalance,
    sendTransaction,
} from '../../../networks/fio';
import {
    BuildTransactionFIOResult,
} from '../../../networks/fio/builder/types';
import { CurrencyBalanceResult, EstimateFeeResult } from '../../../networks/types';
import CoinWallet from '../../wallet';
import { BuildTransactionParams } from './types';
import ECDSACoin from '@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa';

class FIOWallet extends CoinWallet {
    base!: ECDSACoin;
    /**
     * Estimates the fee for a transaction using the provided parameters.
     *
     * @param {string} walletName - The name of the wallet for which to estimate the fee.
     * @return {Promise<EstimateFeeResult>} A promise that resolves to the estimated fee result.
     */
    estimateFee(walletName?:string): Promise<EstimateFeeResult> {
        return estimateFee(this.getReceiveAddress({
            walletName: walletName ?? this.walletSelected,
        }));
    }
    /**
     * Builds a transaction using the provided transaction parameters.
     *
     * @param {BuildTransactionParams} _props - The transaction parameters.
     * @return {Promise<BuildTransactionFIOResult>} A promise that resolves to the result of the transaction build.
     */
    buildTransaction(
        _props: BuildTransactionParams,
    ): Promise<BuildTransactionFIOResult> {
        const rootNode = this.base.getRootNode(_props.mnemonic)
        const privateAccountNode = this.base.getPrivateMasterKey({rootNode})
        const privateKey = this.base.getPrivateAddress({privateAccountNode})
        return buildTransaction({
            ..._props,
            source: this.getReceiveAddress({
                walletName: _props.walletName ?? this.walletSelected,
            }),
            privateKey
            
        });
    }
    /**
     * Retrieves the balance for the wallet.
     *
     * @param {string} walletName - The name of the wallet for which to retrieve the balance.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance(walletName?:string): Promise<CurrencyBalanceResult> {
        return getBalance(this.getReceiveAddress({
            walletName: walletName ?? this.walletSelected,
        }));
    }
    /**
     * Sends a transaction using the provided transaction result.
     *
     * @param {BuildTransactionFIOResult} _props - The transaction result to send.
     * @return {Promise<string>} A promise that resolves to the result of the transaction send.
     */
    sendTransaction(_props: BuildTransactionFIOResult): Promise<string> {
        return sendTransaction(_props);
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector() {
        throw new Error(NotImplemented);
    }

    /**
     * Retrieves the account associated with the given wallet name.
     *
     * @param {string} walletName - The name of the wallet. If not provided, the currently selected wallet will be used.
     * @return {string} The account associated with the given wallet name.
     */
    getAccount(walletName?:string): string {
        return this.account[walletName ?? this.walletSelected];
    }
}

export default FIOWallet;
