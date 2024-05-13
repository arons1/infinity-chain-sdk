import {
    BuySellDetails,
    CurrencyBalanceResult,
    EstimateFeeResult,
    SwapDetails,
    Transaction,
    TransactionType,
} from '../../../networks/types';
import {
    buildTransaction,
    estimateFee,
    getBalance,
    sendTransaction,
} from '../../../networks/xrp';
import CoinWallet from '../../wallet';
import { XrplClient } from 'xrpl-client';
import { BuildTransactionParams, GetTransactionsParams } from './types';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { getTransactions } from '../../../transactionParsers/xrp/get';
import { SetTransactionFormatParams } from '../../types';

class XRPWallet extends CoinWallet {
    connector!: XrplClient;
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
     * @return {EstimateFeeResult} The estimated fee result.
     */
    estimateFee(): EstimateFeeResult {
        return estimateFee({
            connector: this.connector,
        });
    }
    /**
     * Builds a transaction using the provided parameters.
     *
     * @param {BuildTransactionParams} _props - The parameters for building the transaction.
     * @return {Promise<string>} A promise that resolves to the built transaction.
     */
    buildTransaction(_props: BuildTransactionParams): Promise<string> {
        const seed = this.base.getSeed({ mnemonic: _props.mnemonic });
        const keyPair = this.base.getKeyPair({ seed });
        return buildTransaction({
            ..._props,
            connector: this.connector,
            keyPair,
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
            connector: this.connector,
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
     * Initializes the connector for the current object.
     *
     * @param {}
     * @return {}
     */
    loadConnector() {
        this.connector = new XrplClient(config[this.id].rpc);
    }

    /**
     * Calculates the minimum balance required for the XRP wallet.
     *
     * @return {number} The minimum balance in XRP.
     */
    async getMinimumBalance(): Promise<number> {
        return new BigNumber(this.connector.getState().reserve.base as number)
            .plus(this.connector.getState().reserve.owner as number)
            .shiftedBy(6)
            .toNumber();
    }
    /**
     * Sets the transaction format for the given transactions based on the provided parameters.
     *
     * @param {SetTransactionFormatParams} params - The parameters for setting the transaction format.
     * @param {SwapHistoricalTransaction[]} params.swapHistorical - The historical swap transactions.
     * @param {Transaction[]} params.transactions - The transactions to set the format for.
     * @param {string} [params.walletName] - The name of the wallet. If not provided, the currently selected wallet will be used.
     * @param {BuySellHistoricalTransaction[]} [params.buysellHistorical] - The historical buy/sell transactions.
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

export default XRPWallet;
