import {
    BalanceResult,
    BuySellDetails,
    CurrencyBalanceResult,
    EstimateFeeResult,
    Transaction as TransactionNetwork,
    TransactionType,
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
import {
    GetChangeAddressParams,
    SetTransactionFormatParams,
} from '../../types';
import {
    BuildParameters,
    EstimateFeeParams,
    GetTransactionsParams,
} from './types';
import { Coins, Protocol } from '@infinity/core-sdk/lib/commonjs/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import SECP256K1Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/secp256k1';
import { WalletNotFound } from '../../../errors/networks';
import { getTransactions } from '../../../transactionParsers/trezor/get';
import { formatSwap } from '../../utils';

class UTXOWallet extends CoinWallet {
    connector!: TrezorWebsocket;
    base!: SECP256K1Coin;

    /**
     * Constructs a new instance of the class.
     *
     * @param {Coins} id - The ID of the instance.
     * @param {string} [mnemonic] - The mnemonic phrase for the instance.
     * @param {string} [walletAccount] - The name of the wallet.
     */
    constructor(
        id: Coins,
        mnemonic?: string,
        walletName?: string,
        walletAccount?: number,
    ) {
        super(id, mnemonic, walletName, walletAccount);
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
                this.extendedPublicKeys[_props.walletName][
                    _props.walletAccount
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
                rootNode: _props.rootNode,
                protocol: derivation.protocol,
                walletAccount: _props.walletAccount,
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
     * @param {string} walletAccount - (Optional) The name of the wallet. If not provided, the default wallet will be used.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance({
        walletAccount,
        walletName,
    }: {
        walletName: string;
        walletAccount: number;
    }): Promise<CurrencyBalanceResult> {
        return getBalance({
            extendedPublicKeys: Object.values(
                this.extendedPublicKeys[walletName][
                    walletAccount ?? this.walletSelected
                ],
            ),
            connector: this.connector,
        });
    }

    /**
     * Retrieves the account balances for a given wallet name or all wallets if no wallet name is provided.
     *
     * @param {string} [walletAccount] - The name of the wallet to retrieve balances for. If not provided, balances for all wallets will be retrieved.
     * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
     */
    getAccountBalances({
        walletAccount,
        walletName,
    }: {
        walletName: string;
        walletAccount: number;
    }): Promise<Record<string, BalanceResult[]>> {
        if (
            !this.extendedPublicKeys[walletName] ||
            !this.extendedPublicKeys[walletName][walletAccount]
        ) {
            throw new Error('Wallet not found');
        }
        let extendedPublicKeys: string[] = [];
        Object.values(this.extendedPublicKeys[walletName][walletAccount]).map(
            a => Object.values(a).map(b => extendedPublicKeys.push(b)),
        );
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
     * @param {string} [walletAccount] - (Optional) The name of the wallet. If not provided, the default wallet will be used.
     * @return {Promise<UTXOResult[]>} A promise that resolves to an array of UTXOResult objects.
     */
    getUTXO(
        protocol: Protocol,
        walletName: string,
        walletAccount: number,
    ): Promise<UTXOResult[]> {
        if (
            !this.extendedPublicKeys[walletName] ||
            !this.extendedPublicKeys[walletName][walletAccount] ||
            !this.extendedPublicKeys[walletName][walletAccount][protocol]
        ) {
            throw new Error('Wallet not found');
        }
        return getUTXO({
            extendedPublicKey:
                this.extendedPublicKeys[walletName][walletAccount][protocol],
            connector: this.connector,
        });
    }
    /**
     * Retrieves the last change index for a given protocol and wallet.
     *
     * @param {Protocol} protocol - The protocol for which to retrieve the last change index.
     * @param {string} [walletAccount] - (Optional) The name of the wallet to retrieve the last change index for. If not provided, the last change index for the selected wallet will be retrieved.
     * @return {Promise<ChangeIndexResolve>} A promise that resolves to the last change index.
     */
    getLastChangeIndex(
        protocol: Protocol,
        walletAccount: number,
        walletName: string,
    ): Promise<ChangeIndexResolve> {
        if (
            !this.extendedPublicKeys[walletName] ||
            !this.extendedPublicKeys[walletName][walletAccount] ||
            !this.extendedPublicKeys[walletName][walletAccount][protocol]
        ) {
            throw new Error('Wallet not found');
        }
        return getLastChangeIndex({
            extendedPublicKey:
                this.extendedPublicKeys[walletName][walletAccount][protocol],
            connector: this.connector,
        });
    }
    /**
     * Retrieves transactions based on the specified parameters.
     *
     * @param {string} walletAccount - The name of the wallet.
     * @param {string} lastBlockHeight - The last block height.
     * @return {Promise<TransactionNetwork[]>} A promise that resolves to an array of transactions.
     */
    async getTransactions({
        walletAccount,
        lastBlockHeight,
        swapHistorical,
        walletName,
    }: GetTransactionsParams): Promise<TransactionNetwork[]> {
        if (
            !this.extendedPublicKeys[walletName] ||
            !this.extendedPublicKeys[walletName][walletAccount]
        ) {
            throw new Error('Wallet not found');
        }
        const results: TransactionNetwork[] = [];
        const xpubs = Object.values(
            this.extendedPublicKeys[walletName][walletAccount],
        ).filter(a => a.length > 0);
        for (let xpub of xpubs) {
            const txs = await getTransactions({
                address: xpub,
                lastBlockHeight,
                coinId: this.id,
            });
            txs.filter(
                b => results.find(t => t.hash === b.hash) == undefined,
            ).map(a => results.push(a));
        }
        const transactions = results.sort((a, b) =>
            parseInt(a.blockNumber + '') > parseInt(b.blockNumber + '')
                ? -1
                : 1,
        );
        this.setTransactionFormat({
            swapHistorical,
            transactions,
            walletAccount,
            walletName,
        });
        return transactions;
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
     * @param {string} _props.walletAccount - The name of the wallet.
     * @param {string} _props.protocol - The protocol for the change address.
     * @param {number} _props.changeIndex - The index of the change address.
     * @return {string} The change address.
     */
    getChangeAddress(_props: GetChangeAddressParams): string {
        if (
            this.publicNode[_props.walletAccount][_props.protocol] === undefined
        ) {
            throw new Error(WalletNotFound);
        }
        return this.base.getPublicAddress({
            index: _props.changeIndex,
            change: 1,
            publicAccountNode:
                this.publicNode[_props.walletName][_props.walletAccount][
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

    private getAddresses({
        walletAccount,
        walletName,
    }: {
        walletAccount: number;
        walletName: string;
    }) {
        const addresses = [];
        for (let p of Object.keys(
            this.extendedPublicKeys[walletName][walletAccount],
        )) {
            addresses.push(
                this.getReceiveAddress({
                    walletAccount,
                    walletName,
                    protocol: p as unknown as Protocol,
                }),
            );
        }
        return addresses;
    }
    /**
     * Sets the transaction format for a given set of transactions.
     *
     * @param {SetTransactionFormatParams} swapHistorical - An array of historical swaps.
     * @param {Transaction[]} transactions - An array of transactions to format.
     * @param {string} walletAccount - The name of the wallet.
     * @param {BuySellHistorical[]} buysellHistorical - An array of historical buys and sells.
     * @return {void} This function does not return anything.
     */
    setTransactionFormat({
        swapHistorical,
        transactions,
        walletAccount,
        buysellHistorical,
        walletName,
    }: SetTransactionFormatParams) {
        if (
            !this.extendedPublicKeys[walletName] ||
            !this.extendedPublicKeys[walletName][walletAccount]
        ) {
            throw new Error('Wallet not found');
        }
        const addresses = this.getAddresses({ walletAccount, walletName });
        for (let tr of transactions) {
            const swapTransaction = swapHistorical?.find(
                b => b.hash == tr.hash || b.hash_to == tr.hash,
            );
            if (swapTransaction) {
                tr.transactionType = TransactionType.SWAP;
                tr.swapDetails = formatSwap(swapTransaction);
                continue;
            }
            const buySellTransaction: BuySellDetails | undefined =
                buysellHistorical?.find(b => b.txid == tr.hash);

            if (buySellTransaction) {
                tr.transactionType = TransactionType.BUYSELL;
                tr.buySellDetails = buySellTransaction;
            } else {
                const voutReceive = addresses.find(a =>
                    tr.vOut?.find(b => b.address == a),
                );
                if (voutReceive) tr.transactionType = TransactionType.RECEIVE;
                else tr.transactionType = TransactionType.SEND;
            }
        }
    }
}

export default UTXOWallet;
