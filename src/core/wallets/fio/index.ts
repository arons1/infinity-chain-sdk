import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import {
    buildTransaction,
    estimateFee,
    getBalance,
    sendTransaction,
} from '../../../networks/fio';
import { BuildTransactionFIOResult } from '../../../networks/fio/builder/types';
import {
    CurrencyBalanceResult,
    EstimateFeeResult,
    Transaction,
} from '../../../networks/types';
import CoinWallet from '../../wallet';
import { BuildTransactionParams, GetTransactionsParams } from './types';
import ECDSACoin from '@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { getTransactions } from '../../../transactionParsers/fio/get';

import { Coins, Protocol } from '@infinity/core-sdk/lib/commonjs/networks';
import {
    getPrivateKey,
    getPrivateMasterKey,
    getRootNode,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1';
import networks from '@infinity/core-sdk/lib/commonjs/networks/networks';
import { GetPrivateKeyParams } from '../../types';
import { getFIOPrivateAddress } from '@infinity/core-sdk/lib/commonjs/networks/evm';

class FIOWallet extends CoinWallet {
    base!: ECDSACoin;

    constructor(
        id: Coins,
        mnemonic?: string,
        walletName?: string,
        walletAccount?: number,
    ) {
        super(id, mnemonic, walletName, walletAccount);
    }

    /**
     * Estimates the fee for a transaction using the provided parameters.
     *
     * @param {Object} options - The options for estimating the fee.
     * @param {number} options.walletAccount - The account number of the wallet.
     * @param {string} options.walletName - The name of the wallet.
     * @return {Promise<EstimateFeeResult>} A promise that resolves to the estimated fee result.
     */
    estimateFee({
        walletAccount,
        walletName,
    }: {
        walletAccount: number;
        walletName: string;
    }): Promise<EstimateFeeResult> {
        const address = this.getReceiveAddress({ walletAccount, walletName });
        return estimateFee(address);
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
        const address = this.getReceiveAddress({
            walletAccount: _props.walletAccount,
            walletName: _props.walletName,
        });
        return buildTransaction({ ..._props, source: address });
    }

    /**
     * Retrieves the balance for the wallet.
     *
     * @param {Object} options - The options for retrieving the balance.
     * @param {number} options.walletAccount - The account number of the wallet.
     * @param {string} options.walletName - The name of the wallet.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance({
        walletAccount,
        walletName,
    }: {
        walletAccount: number;
        walletName: string;
    }): Promise<CurrencyBalanceResult> {
        const address = this.getReceiveAddress({ walletAccount, walletName });
        return getBalance(address);
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
     * @return {Promise<Transaction[]>} A promise that resolves to an array of transactions.
     */
    async getTransactions({
        walletAccount,
        endBlock,
        swapHistorical,
        walletName,
    }: GetTransactionsParams): Promise<Transaction[]> {
        const address = this.getReceiveAddress({ walletAccount, walletName });
        const transactions = await getTransactions({ address, endBlock });
        this.setTransactionFormat({
            swapHistorical,
            transactions,
            walletAccount,
            walletName,
        });
        return transactions;
    }

    loadConnector(): void {
        throw new Error(NotImplemented);
    }

    /**
     * Retrieves the account associated with the given wallet name.
     *
     * @param {Object} options - The options for retrieving the account.
     * @param {string} options.walletName - The name of the wallet.
     * @param {number} options.walletAccount - The account number of the wallet.
     * @return {string} The account associated with the given wallet name.
     */
    getAccount({
        walletAccount,
        walletName,
    }: {
        walletAccount: number;
        walletName: string;
    }): string {
        return this.account[walletName][walletAccount];
    }

    /**
     * Retrieves the minimum amount left from the configuration for the current wallet.
     *
     * @return {Promise<number>} The minimum amount left as specified in the configuration.
     */
    async getMinimumAmountLeft(): Promise<number> {
        return config[this.id].dust as number;
    }

    /**
     * Retrieves the private key associated with the given mnemonic and wallet account.
     *
     * @param {GetPrivateKeyParams} mnemonic - The mnemonic phrase used to generate the private key.
     * @param {number} walletAccount - The wallet account number.
     * @return {string | undefined} The private key associated with the given mnemonic and wallet account, or undefined if it does not exist.
     */
    getPrivateKey({ mnemonic, walletAccount }: GetPrivateKeyParams) {
        const rootNode = getRootNode({
            mnemonic,
            network: networks[Coins.ETH],
        });
        const privateAccountNode = getPrivateMasterKey({
            bipIdCoin: this.bipIdCoin,
            protocol: Protocol.LEGACY,
            rootNode,
            walletAccount,
        });
        return getPrivateKey({
            privateAccountNode,
            network: networks[Coins.FIO],
        })?.privateKey;
    }

    /**
     * Retrieves the private address associated with the given private key.
     *
     * @param {Buffer} privateKey - The private key used to generate the private address.
     * @return {string} The private address generated from the private key.
     */
    getPrivateAddress(privateKey: Buffer): string {
        return getFIOPrivateAddress({
            privateKey,
        });
    }
}

export default FIOWallet;
