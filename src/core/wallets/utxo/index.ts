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

import CoinWallet from '../../wallet';
import { getUTXO } from '../../../networks/utxo/getUTXO/index';
import { UTXOResult } from '../../../networks/utxo/getUTXO/types';
import { getLastChangeIndex } from '../../../networks/utxo/getLastChangeIndex/index';
import { ChangeIndexResolve } from '../../../networks/utxo/getLastChangeIndex/types';
import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import { GetChangeAddressParams } from '../../types';
import { BuildParameters, EstimateFeeParams } from './types';
import { Coins, Protocol } from '@infinity/core-sdk/lib/commonjs/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import SECP256K1Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/secp256k1';
import { WalletNotFound } from '../../../errors/networks';

class UTXOWallet extends CoinWallet {
    connector!: TrezorWebsocket;
    base!: SECP256K1Coin;

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
     * Estimates the fee for a transaction based on the provided parameters.
     *
     * @param {EstimateFeeParams} _props - The parameters for estimating the fee.
     * @return {Promise<EstimateFeeResult>} - A promise that resolves to the estimated fee.
     */
    estimateFee(_props: EstimateFeeParams): Promise<EstimateFeeResult> {
        const extendedPublicKeys: string[] = [];
        for (let derivation of config[this.id].derivations) {
            extendedPublicKeys.push(
                this.extendedPublicKeys[
                    _props.walletName ?? this.walletSelected
                ][derivation.protocol],
            );
        }
        return estimateFee({
            ..._props,
            connector: this.connector,
            coinId: this.id,
            extendedPublicKeys,
        });
    }
    /**
     * Builds a transaction using the provided parameters.
     *
     * @param {BuildParameters} _props - The parameters for building the transaction.
     * @return {Promise<BuildTransactionResult>} - A promise that resolves to the built transaction.
     */
    buildTransaction(_props: BuildParameters): Promise<BuildTransactionResult> {
        const protocolAddress = _props.changeAddressProtocol ?? Protocol.SEGWIT;
        const accounts: Account[] = [];
        for (let derivation of config[this.id].derivations) {
            const privateAccountNode = this.base.getPrivateMasterKey({
                rootNode: this.base.getRootNode(_props.mnemonic),
                protocol: derivation.protocol,
            });
            const account: Account = {
                node: privateAccountNode,
                extendedPublicKey: privateAccountNode
                    .neutered()
                    .neutered()
                    .toBase58(),
                useAsChange: protocolAddress == derivation.protocol,
            };
            accounts.push(account);
        }
        return buildTransaction({
            ..._props,
            connector: this.connector,
            accounts,
        });
    }
    /**
     * Retrieves the balance for the specified wallet.
     *
     * @param {string} walletName - (Optional) The name of the wallet. If not provided, the default wallet will be used.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance(walletName?: string): Promise<CurrencyBalanceResult> {
        return getBalance({
            extendedPublicKeys: Object.values(
                this.extendedPublicKeys[walletName ?? this.walletSelected],
            ),
            connector: this.connector,
        });
    }

    /**
     * Retrieves the account balances for a given wallet name or all wallets if no wallet name is provided.
     *
     * @param {string} [walletName] - The name of the wallet to retrieve balances for. If not provided, balances for all wallets will be retrieved.
     * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
     */
    getAccountBalances(
        walletName?: string,
    ): Promise<Record<string, BalanceResult[]>> {
        let extendedPublicKeys: string[] = [];
        let accounts =
            walletName != undefined
                ? [walletName]
                : Object.keys(this.addresses);
        accounts
            .map(a => Object.values(this.extendedPublicKeys[a]))
            .map(a => {
                extendedPublicKeys = [
                    ...extendedPublicKeys,
                    ...Object.values(a),
                ];
            });
        return getAccountBalances({
            extendedPublicKeys,
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
        return sendTransaction({
            rawTransaction,
            connector: this.connector,
        });
    }
    /**
     * Retrieves the UTXO (Unspent Transaction Output) for a given protocol and wallet.
     *
     * @param {Protocol} protocol - The protocol for which to retrieve the UTXO.
     * @param {string} [walletName] - (Optional) The name of the wallet. If not provided, the default wallet will be used.
     * @return {Promise<UTXOResult[]>} A promise that resolves to an array of UTXOResult objects.
     */
    getUTXO(protocol: Protocol, walletName?: string): Promise<UTXOResult[]> {
        return getUTXO({
            extendedPublicKey:
                this.extendedPublicKeys[walletName ?? this.walletSelected][
                    protocol
                ],
            connector: this.connector,
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
        protocol: Protocol,
        walletName?: string,
    ): Promise<ChangeIndexResolve> {
        return getLastChangeIndex({
            extendedPublicKey:
                this.extendedPublicKeys[walletName ?? this.walletSelected][
                    protocol
                ],
            connector: this.connector,
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
        this.connector.connect();
    }

    /**
     * Retrieves the change address for a given wallet and protocol.
     *
     * @param {GetChangeAddressParams} _props - The parameters for retrieving the change address.
     * @param {string} _props.walletName - The name of the wallet.
     * @param {string} _props.protocol - The protocol for the change address.
     * @param {number} _props.changeIndex - The index of the change address.
     * @return {string} The change address.
     */
    getChangeAddress(_props: GetChangeAddressParams): string {
        if (
            this.publicNode[_props.walletName ?? this.walletSelected][
                _props.protocol
            ] === undefined
        ) {
            throw new Error(WalletNotFound);
        }
        return this.base.getPublicAddress({
            index: _props.changeIndex,
            change: 1,
            publicAccountNode:
                this.publicNode[_props.walletName ?? this.walletSelected][
                    _props.protocol
                ],
            protocol: _props.protocol,
        }) as string;
    }

    /**
     * Retrieves the minimum amount left from the configuration for the current wallet.
     *
     * @return {number} The minimum amount left as specified in the configuration.
     */
    async getMinimumAmountLeft(): Promise<number> {
        return config[this.id].dust as number;
    }
    async getMinimumAmountSend(_props: any): Promise<number> {
        return config[this.id].dust as number;
    }
}

export default UTXOWallet;
