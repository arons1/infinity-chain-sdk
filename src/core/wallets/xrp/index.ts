import {
    CurrencyBalanceResult,
    EstimateFeeResult,
    Transaction,
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
import { Coins, Protocol } from '@infinity/core-sdk/lib/commonjs/networks';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { getTransactions } from '../../../transactionParsers/xrp/get';
import {
    getPrivateKey,
    getPrivateMasterKey,
    getRootNode,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1';
import { GetPrivateKeyParams } from '../../types';
import networks from '@infinity/core-sdk/lib/commonjs/networks/networks';
import {
    getKeyPair,
    getSeed,
    getSecretAddress,
} from '@infinity/core-sdk/lib/commonjs/networks/ed25519';

class XRPWallet extends CoinWallet {
    connector!: XrplClient;
    base!: ED25519Coin;

    /**
     * Constructs a new instance of the XRPWallet class.
     *
     * @param {Coins} id - The ID of the instance.
     * @param {string} [mnemonic] - The mnemonic phrase for the instance.
     * @param {string} [walletName] - The name of the wallet.
     * @param {number} [walletAccount] - The account ID of the wallet.
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
        return buildTransaction({
            ..._props,
            connector: this.connector,
        });
    }

    /**
     * Retrieves the balance for the specified wallet.
     *
     * @param {string} walletAccount - (Optional) The name of the wallet to retrieve the balance for. If not provided, the balance of the currently selected wallet will be retrieved.
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
            address: this.getReceiveAddress({
                walletAccount,
                walletName,
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
     * @param {string} params.walletAccount - (Optional) The name of the wallet to retrieve transactions for. If not provided, the transactions of the currently selected wallet will be retrieved.
     * @param {string} params.lastTransactionHash - The hash of the last transaction.
     * @return {Promise<Transaction[]>} A promise that resolves to an array of transactions.
     */
    async getTransactions({
        walletAccount,
        lastTransactionHash,
        swapHistorical,
        walletName,
    }: GetTransactionsParams): Promise<Transaction[]> {
        const transactions = await getTransactions({
            connector: this.connector,
            address: this.getReceiveAddress({
                walletAccount,
                walletName,
            }),
            lastTransactionHash,
        });
        this.setTransactionFormat({
            swapHistorical,
            transactions,
            walletAccount,
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
        return getPrivateKey({ privateAccountNode })?.privateKey;
    }
    getKeyPair({ mnemonic, walletAccount }: GetPrivateKeyParams): void {
        const seed = getSeed({
            mnemonic,
        });
        const path = config[this.id].derivations[0].path.replace(
            'ACCOUNT',
            walletAccount.toString(),
        );
        return getKeyPair({ path, seed, walletAccount });
    }
    getPrivateAddress(privateKey: Buffer): string {
        return getSecretAddress({
            bipIdCoin: this.bipIdCoin,
            secretKey: privateKey,
        });
    }
}

export default XRPWallet;
