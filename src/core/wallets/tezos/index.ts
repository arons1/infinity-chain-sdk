import {
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    sendTransaction,
} from '../../../networks/tezos';
import { BuildTransactionResult } from '../../../networks/tezos/builder/types';

import {
    BalanceResult,
    BuySellDetails,
    CurrencyBalanceResult,
    EstimateFeeResult,
    SwapDetails,
    Transaction,
    TransactionType,
} from '../../../networks/types';
import CoinWallet from '../../wallet';
import {
    BuildTransactionParams,
    EstimateFeeParams,
    GetAccountBalancesParams,
    GetTransactionsParams,
    SignMessageParams,
    SignTransactionParams,
} from './types';
import { TezosToolkit } from '@taquito/taquito';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';

import {
    getPrivateKey,
    getTezosPublicKeyHash,
    sign,
    signTransaction,
} from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { getTransactions } from '../../../transactionParsers/tezos/get';
import { SetTransactionFormatParams } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

class TezosWallet extends CoinWallet {
    connector!: TezosToolkit;
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
     * Estimates the fee for a transaction on the Tezos blockchain.
     *
     * @param {EstimateFeeParams} _props - The parameters for estimating the fee.
     * @param {string} _props.walletName - The name of the wallet to use for estimation.
     * @returns {Promise<EstimateFeeResult>} - A promise that resolves to the estimated fee result.
     */
    estimateFee(_props: EstimateFeeParams): Promise<EstimateFeeResult> {
        return estimateFee({
            ..._props,
            pkHash: this.account[_props.walletName ?? this.walletSelected],
            source: this.getReceiveAddress({
                walletName: _props.walletName ?? this.walletSelected,
            }),
            connector: this.connector,
        });
    }
    /**
     * Builds a transaction using the provided parameters.
     *
     * @param {BuildTransactionParams} _props - The parameters for building the transaction.
     * @return {Promise<BuildTransactionResult>} - A promise that resolves to the built transaction.
     */
    buildTransaction(
        _props: BuildTransactionParams,
    ): Promise<BuildTransactionResult> {
        const privateKey = getPrivateKey({ keyPair: _props.keyPair });
        const pkHash = getTezosPublicKeyHash({
            keyPair: _props.keyPair,
        });
        const source = this.base.getPublicAddress({ keyPair: _props.keyPair });
        return buildTransaction({
            ..._props,
            pkHash,
            source,
            connector: this.connector,
            privateKey,
        });
    }
    /**
     * Retrieves the balance for the specified wallet.
     *
     * @param {string} walletName - (Optional) The name of the wallet to retrieve the balance for. If not provided, the balance of the currently selected wallet will be retrieved.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance(walletName?: string): Promise<CurrencyBalanceResult> {
        return getBalance({
            address: this.getReceiveAddress({
                walletName: walletName ?? this.walletSelected,
            }),
        });
    }

    /**
     * Retrieves the balances for a given set of accounts or all wallets added using the RPCBalancesParams.
     *
     * @param {GetAccountBalancesParams} _props - The parameters for retrieving account balances.
     * @param {string[]} _props.accounts - The accounts to retrieve balances for.
     * @param {string} _props.walletName - The name of the wallet to retrieve balances for. If not provided, balances for all wallets will be retrieved.
     * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
     */
    getAccountBalances(
        _props: GetAccountBalancesParams,
    ): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances({
            ..._props,
            accounts:
                _props.walletName != undefined
                    ? [
                          this.getReceiveAddress({
                              walletName:
                                  _props.walletName ?? this.walletSelected,
                          }),
                      ]
                    : Object.keys(this.addresses).map(walletName =>
                          this.getReceiveAddress({
                              walletName,
                          }),
                      ),
        });
    }
    /**
     * Sends a transaction using the provided parameters.
     *
     * @param {BuildTransactionParams} _props - The parameters for building the transaction.
     * @return {Promise<string>} - A promise that resolves to the transaction hash.
     */
    sendTransaction(_props: BuildTransactionParams): Promise<string> {
        const privateKey = getPrivateKey({ keyPair: _props.keyPair });
        const pkHash = getTezosPublicKeyHash({
            keyPair: _props.keyPair,
        });
        const source = this.base.getPublicAddress({ keyPair: _props.keyPair });
        return sendTransaction({
            ..._props,
            pkHash,
            source,
            connector: this.connector,
            privateKey,
        });
    }
    /**
     * Retrieves transactions based on the specified parameters.
     *
     * @param {GetTransactionsParams} params - The parameters for retrieving transactions.
     * @param {string} params.walletName - (Optional) The name of the wallet to retrieve transactions for. If not provided, the transactions of the currently selected wallet will be retrieved.
     * @param {string} params.lastTransactionHash - The hash of the last transaction.
     * @return {Promise<Transaction[]>} A promise that resolves to an array of transactions.
     */
    async getTransactions({
        walletName,
        lastTransactionHash,
        swapHistorical,
    }: GetTransactionsParams): Promise<Transaction[]> {
        const transactions = await getTransactions({
            address: this.getReceiveAddress({
                walletName: walletName ?? this.walletSelected,
            }),
            lastTransactionHash,
        });
        this.setTransactionFormat({
            swapHistorical,
            transactions,
            walletName,
        });
        return transactions;
    }
    /**
     * Loads the connector for the Tezos wallet based on the specified BIP ID coin.
     *
     * @throws {Error} If the API RPC for the BIP ID coin is not defined.
     */
    loadConnector() {
        this.connector = new TezosToolkit(config[this.id].rpc[0]);
    }

    /**
     * Retrieves the public key hash for a given wallet name.
     *
     * @param {string} walletName - (Optional) The name of the wallet to retrieve the public key hash for.
     * @return {string} The public key hash for the specified wallet name.
     */
    getPublickeyHash(walletName?: string): string {
        return this.account[walletName ?? this.walletSelected];
    }

    /**
     * Signs a transaction using the provided parameters.
     *
     * @param {SignTransactionParams} _props - The parameters for signing the transaction.
     * @param {any} _props.keyPair - The keyPair used for signing.
     * @return {Promise<string>} - A promise that resolves to the signed transaction.
     */
    signTransaction(_props: SignTransactionParams): Promise<string> {
        return signTransaction({
            ..._props,
            coinId: this.id,
        });
    }

    /**
     * Signs a message using the provided secretKey and message.
     *
     * @param {SignMessageParams} _props - The parameters for signing the message.
     * @param {Buffer} _props.secretKey - The secretKey used for signing.
     * @param {string} _props.message - The message to sign.
     * @return {Uint8Array} The signed message.
     */
    signMessage(_props: SignMessageParams): Uint8Array {
        return sign({
            secretKey:_props.secretKey,
            message: _props.message,
        });
    }
    /**
     * Sets the transaction format based on historical swap, buy/sell data, and token transfers.
     *
     * @param {Transaction[]} transactions - The array of transactions to set the format for.
     * @param {string} walletName - The name of the wallet used for the transactions.
     * @param {Transaction[]} swapHistorical - The historical swap transactions.
     * @param {Transaction[]} buysellHistorical - The historical buy/sell transactions.
     */
    setTransactionFormat({
        swapHistorical,
        transactions,
        walletName,
        buysellHistorical,
    }: SetTransactionFormatParams) {
        const address = this.getReceiveAddress({
            walletName: walletName ?? this.walletSelected,
        });
        for (let tr of transactions) {
            const isSwap = swapHistorical?.find(
                b => b.hash == tr.hash || b.hash_to == tr.hash,
            );
            const isBuySell = buysellHistorical?.find(b => b.txid == tr.hash);

            if (isSwap) {
                tr.transactionType = TransactionType.SWAP;
                tr.swapDetails = {
                    exchange: isSwap.exchange,
                    fromAmount: isSwap.amount,
                    toAmount: isSwap.amount_des,
                    fromCoin: isSwap.from,
                    toCoin: isSwap.to,
                    fromAddress: isSwap.sender_address,
                    toAddress: isSwap.receive_address,
                    hashTo: isSwap.hash_to,
                    hash: isSwap.hash,
                } as SwapDetails;
            } else if (isBuySell) {
                tr.transactionType = TransactionType.BUYSELL;
                tr.buySellDetails = { ...isBuySell } as BuySellDetails;
            } else if (tr.tokenTransfers && tr.tokenTransfers?.length > 1) {
                const outAmount =
                    tr.tokenTransfers.find(
                        a =>
                            a.from == address &&
                            new BigNumber(a.value).isGreaterThan(0),
                    ) != undefined;
                const inAmount =
                    tr.tokenTransfers.find(
                        a =>
                            a.to == address &&
                            new BigNumber(a.value).isGreaterThan(0),
                    ) != undefined;
                if (outAmount && inAmount) {
                    tr.transactionType = TransactionType.TRADE;
                } else if (outAmount) {
                    tr.transactionType = TransactionType.DEPOSIT;
                } else {
                    tr.transactionType = TransactionType.WITHDRAW;
                }
            } else {
                if (tr.from?.toLowerCase() == address.toLowerCase()) {
                    tr.transactionType = TransactionType.SEND;
                } else {
                    tr.transactionType = TransactionType.RECEIVE;
                }
            }
        }
    }
}

export default TezosWallet;
