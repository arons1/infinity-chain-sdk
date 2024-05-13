import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import {
    buildTransaction,
    estimateFee,
    getBalance,
    sendTransaction,
} from '../../../networks/fio';
import { BuildTransactionFIOResult } from '../../../networks/fio/builder/types';
import {
    BuySellDetails,
    CurrencyBalanceResult,
    EstimateFeeResult,
    SwapDetails,
    Transaction,
    TransactionType,
} from '../../../networks/types';
import CoinWallet from '../../wallet';
import { BuildTransactionParams, GetTransactionsParams } from './types';
import ECDSACoin from '@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { getTransactions } from '../../../transactionParsers/fio/get';
import { SetTransactionFormatParams } from '../../types';

class FIOWallet extends CoinWallet {
    base!: ECDSACoin;

    /**
     * Estimates the fee for a transaction using the provided parameters.
     *
     * @param {string} walletName - The name of the wallet for which to estimate the fee.
     * @return {Promise<EstimateFeeResult>} A promise that resolves to the estimated fee result.
     */
    estimateFee(walletName?: string): Promise<EstimateFeeResult> {
        return estimateFee(
            this.getReceiveAddress({
                walletName: walletName ?? this.walletSelected,
            }),
        );
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
        const rootNode = this.base.getRootNode(_props.mnemonic);
        const privateAccountNode = this.base.getPrivateMasterKey({ rootNode });
        const privateKey = this.base.getPrivateAddress({ privateAccountNode });
        return buildTransaction({
            ..._props,
            source: this.getReceiveAddress({
                walletName: _props.walletName ?? this.walletSelected,
            }),
            privateKey,
        });
    }
    /**
     * Retrieves the balance for the wallet.
     *
     * @param {string} walletName - The name of the wallet for which to retrieve the balance.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance(walletName?: string): Promise<CurrencyBalanceResult> {
        return getBalance(
            this.getReceiveAddress({
                walletName: walletName ?? this.walletSelected,
            }),
        );
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
    /**
     * Retrieves transactions based on the specified parameters.
     *
     * @param {GetTransactionsParams} params - The parameters for retrieving transactions.
     * @param {string} params.walletName - (Optional) The name of the wallet to retrieve transactions for. If not provided, the transactions of the currently selected wallet will be retrieved.
     * @param {string} params.endBlock - The end block to retrieve transactions until.
     * @return {Promise<Transaction[]>} A promise that resolves to an array of transactions.
     */
    async getTransactions({
        walletName,
        endBlock,
        swapHistorical,
    }: GetTransactionsParams): Promise<Transaction[]> {
        const transactions = await getTransactions({
            address: this.getReceiveAddress({
                walletName: walletName ?? this.walletSelected,
            }),
            endBlock,
        });
        this.setTransactionFormat({
            swapHistorical,
            transactions,
            walletName,
        });

        return transactions;
    }
    loadConnector() {
        throw new Error(NotImplemented);
    }

    /**
     * Retrieves the account associated with the given wallet name.
     *
     * @param {string} [walletName] - The name of the wallet. If not provided, the currently selected wallet will be used.
     * @return {string} The account associated with the given wallet name.
     */
    getAccount(walletName?: string): string {
        return this.account[walletName ?? this.walletSelected];
    }
    /**
     * Retrieves the minimum amount left from the configuration for the current wallet.
     *
     * @return {number} The minimum amount left as specified in the configuration.
     */
    async getMinimumAmountLeft(): Promise<number> {
        return config[this.id].dust as number;
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

export default FIOWallet;
