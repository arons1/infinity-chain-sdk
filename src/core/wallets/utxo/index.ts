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
import { rawTransaction } from '../../../networks/solana/builder/index';
import { Protocol } from '@infinity/core-sdk/lib/commonjs/networks';

class UTXOWallet extends CoinWallet {
    connector!:TrezorWebsocket;
    /**
     * Estimates the fee for a transaction based on the provided parameters.
     *
     * @param {EstimateFeeParams} _props - The parameters for estimating the fee.
     * @return {Promise<EstimateFeeResult>} - A promise that resolves to the estimated fee.
     */
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
    /**
     * Retrieves the balance for the specified wallet.
     *
     * @param {string} walletName - (Optional) The name of the wallet. If not provided, the default wallet will be used.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance(walletName?:string): Promise<CurrencyBalanceResult> {
        return getBalance({
            extendedPublicKeys:Object.values(this.extendedPublicKeys[walletName ?? this.walletSelected]),
            connector: this.connector
        });
    }
    /**
     * Retrieves the balances for a given set of accounts or all wallets added using the RPCBalancesParams.
     *
     * @param {string} walletName - (Optional) The name of the wallet to retrieve balances for. If not provided, balances for all wallets will be retrieved.
     * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
     */
    getAccountBalances(walletName?:string): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances({
            extendedPublicKeys:Object.values(this.extendedPublicKeys[walletName ?? this.walletSelected]),
            connector: this.connector
        });
    }
    /**
     * Sends a transaction with a raw string to the connected wallet.
     *
     * @param {string} rawTransaction - The raw string of the transaction to send.
     * @return {Promise<string>} A promise that resolves to the transaction ID.
     */
    sendTransaction(rawTransaction:string): Promise<string> {
        return sendTransaction({
            rawTransaction,
            connector: this.connector
        });
    }
    /**
     * Retrieves the UTXO (Unspent Transaction Output) for a given protocol and wallet.
     *
     * @param {Protocol} protocol - The protocol for which to retrieve the UTXO.
     * @param {string} [walletName] - (Optional) The name of the wallet. If not provided, the default wallet will be used.
     * @return {Promise<UTXOResult[]>} A promise that resolves to an array of UTXOResult objects.
     */
    getUTXO(protocol:Protocol,walletName?:string): Promise<UTXOResult[]> {
        return getUTXO({
            extendedPublicKey:this.extendedPublicKeys[walletName ?? this.walletSelected][protocol],
            connector: this.connector
        });
    }
    /**
     * Retrieves the last change index for a given protocol and wallet.
     *
     * @param {Protocol} protocol - The protocol for which to retrieve the last change index.
     * @param {string} [walletName] - (Optional) The name of the wallet to retrieve the last change index for. If not provided, the last change index for the selected wallet will be retrieved.
     * @return {Promise<ChangeIndexResolve>} A promise that resolves to the last change index.
     */
    getLastChangeIndex(
        protocol:Protocol,walletName?:string
    ): Promise<ChangeIndexResolve> {
        return getLastChangeIndex({
            extendedPublicKey:this.extendedPublicKeys[walletName ?? this.walletSelected][protocol],
            connector: this.connector
        });
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    /**
     * Loads the connector for the UTXO wallet.
     *
     * This function initializes a new instance of the TrezorWebsocket class with the provided id,
     * and assigns it to the `connector` property of the UTXO wallet. It then calls the `connect`
     * method on the `connector` object to establish a connection.
     *
     * @return {void} This function does not return a value.
     */
    loadConnector() {
        this.connector = new TrezorWebsocket(this.id);
        this.connector.connect()
    }

    /**
     * Retrieves the change address for a transaction based on the provided parameters.
     *
     * @param {GetChangeAddressParams} _props - The parameters for retrieving the change address.
     * @return {string} The change address for the transaction.
     */
    getChangeAddress(_props: GetChangeAddressParams): string {
        throw new Error(NotImplemented);
    }
}

export default UTXOWallet;
