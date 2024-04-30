import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import {
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    sendTransaction,
} from '../../../networks/stellar';

import {
    BalanceResult,
    CurrencyBalanceResult,
    EstimateFeeResult,
} from '../../../networks/types';
import CoinWallet from '../../wallet';
import { BuildTransactionParams, SignTransactionParams } from './types';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import { Keypair, Server, Transaction } from 'stellar-sdk';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

import config from '@infinity/core-sdk/lib/commonjs/networks/config';

class StellarWallet extends CoinWallet {
    connector!: Server;
    base!: ED25519Coin;
    /**
     * Constructs a new instance of the class.
     *
     * @param {Coins} id - The ID of the instance.
     * @param {string} [mnemonic] - The mnemonic phrase for the instance.
     * @param {string} [walletName] - The name of the wallet.
     */
    constructor(id: Coins, mnemonic?: string, walletName?: string) {
        super(id, mnemonic, walletName);
        this.loadConnector();
    }
    /**
     * Estimates the fee for a transaction.
     *
     * @return {Promise<EstimateFeeResult>} A promise that resolves to the estimated fee result.
     */
    estimateFee(): Promise<EstimateFeeResult> {
        return estimateFee();
    }
    /**
     * Builds a transaction based on the provided parameters.
     *
     * @param {BuildTransactionParams} _props - The parameters for building the transaction.
     * @return {Promise<string>} A promise that resolves to the built transaction.
     */
    buildTransaction(_props: BuildTransactionParams): Promise<string> {
        const seed = this.base.getSeed({
            mnemonic: _props.mnemonic,
        });
        const keyPair = this.base.getKeyPair({
            seed,
        });
        return buildTransaction({
            ..._props,
            source: this.base.getPublicAddress({ keyPair }),
            keyPair,
            connector: this.connector,
        });
    }
    /**
     * Retrieves the balance for the wallet.
     *
     * @param {string} walletName - The name of the wallet for which to retrieve the balance. If not provided, the balance of the selected wallet will be retrieved.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance(walletName?: string): Promise<CurrencyBalanceResult> {
        return getBalance({
            account: this.getReceiveAddress({
                walletName: walletName ?? this.walletSelected,
            }),
            connector: this.connector,
        });
    }
    /**
     * Retrieves the balances for a given set of accounts or all wallets added using the RPCBalancesParams.
     *
     * @param {string[]} [accounts] - The accounts to retrieve balances for. If not provided, balances for all wallets will be retrieved.
     * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
     */
    getAccountBalances(
        walletName?: string,
    ): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances({
            accounts:
                walletName != undefined ? [this.getReceiveAddress({ walletName })] :
                Object.keys(this.addresses).map(a =>
                    this.getReceiveAddress({ walletName:a }),
                ),
            connector: this.connector,
        });
    }
    /**
     * Sends a transaction with a raw string to the connected wallet.
     *
     * @param {string} rawTransaction - The raw string of the transaction to send.
     * @return {Promise<string>} A promise that resolves to the transaction ID.
     */
    sendTransaction(rawTransaction: string): Promise<string> {
        return sendTransaction(rawTransaction);
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    /**
     * Signs a transaction using the provided transaction and mnemonic.
     *
     * @param {SignTransactionParams} _props - The parameters for signing the transaction.
     * @param {string} _props.mnemonic - The mnemonic used for signing.
     * @param {Transaction} _props.transaction - The transaction to sign.
     * @return {Transaction} The signed transaction.
     */
    signTransaction(_props: SignTransactionParams): Transaction {
        const seed = this.base.getSeed({
            mnemonic: _props.mnemonic,
        });
        const keyPair = this.base.getKeyPair({
            seed,
        });
        const key_pair = Keypair.fromSecret(keyPair.secret());
        _props.transaction.sign(key_pair);
        return _props.transaction;
    }

    /**
     * Loads the connector for the specified BIP ID coin.
     *
     * @throws {Error} If the API RPC for the BIP ID coin is not defined.
     */
    loadConnector() {
        this.connector = new Server(config[this.id].rpc[0]);
    }

    /**
     * Retrieves the minimum amount left from the configuration for the current wallet.
     *
     * @return {number} The minimum amount left as specified in the configuration.
     */

    async getMinimumAmountLeft(): Promise<number> {
        return config[this.id].dust as number;
    }
}

export default StellarWallet;
