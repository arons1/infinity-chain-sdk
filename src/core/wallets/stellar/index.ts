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
    Transaction as TransactionNetwork,
    TransactionType,
} from '../../../networks/types';
import CoinWallet from '../../wallet';
import { BuildTransactionParams, SignTransactionParams } from './types';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import { Keypair, Server, Transaction } from 'stellar-sdk';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import {
    BuySellHistoricalTransaction,
    GetPrivateKeyParams,
    SwapHistoricalTransaction,
} from '../../types';
import { formatSwap } from '../../utils';
import {
    getKeyPair,
    getPrivateKey,
    getSecretAddress,
    getSeed,
} from '@infinity/core-sdk/lib/commonjs/networks/ed25519';

class StellarWallet extends CoinWallet {
    connector!: Server;
    base!: ED25519Coin;

    /**
     * Constructs a new instance of the StellarWallet class.
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
     * @return {Promise<EstimateFeeResult>} A promise that resolves to the estimated fee result.
     */
    estimateFee(): Promise<EstimateFeeResult> {
        return estimateFee();
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
            source: this.base.getPublicAddress({ keyPair: _props.keyPair }),
            connector: this.connector,
        });
    }

    /**
     * Retrieves the balance for the specified wallet account and wallet name.
     *
     * @param {Object} options - The options for retrieving the balance.
     * @param {string} options.walletName - The name of the wallet.
     * @param {number} options.walletAccount - The account number of the wallet.
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
            account: this.getReceiveAddress({
                walletAccount,
                walletName,
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
    getAccountBalances({
        walletAccount,
        walletName,
    }: {
        walletName: string;
        walletAccount: number;
    }): Promise<Record<string, BalanceResult[]>> {
        let addresses: string[] = [];
        if (walletAccount !== undefined && walletName !== undefined) {
            addresses = [
                this.getReceiveAddress({
                    walletAccount,
                    walletName,
                }),
            ];
        } else {
            Object.keys(this.addresses).forEach(walletName => {
                Object.keys(this.addresses[walletName]).forEach(
                    walletAccount => {
                        addresses.push(
                            this.getReceiveAddress({
                                walletAccount: parseInt(walletAccount),
                                walletName,
                            }),
                        );
                    },
                );
            });
        }
        return getAccountBalances({
            accounts: addresses,
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

    /**
     * Signs a transaction using the provided transaction and keyPair.
     *
     * @param {SignTransactionParams} _props - The parameters for signing the transaction.
     * @param {string} _props.secretKey - The secretKey used for signing.
     * @param {Transaction} _props.transaction - The transaction to sign.
     * @return {Transaction} The signed transaction.
     */
    signTransaction(_props: SignTransactionParams): Transaction {
        const keyPair = Keypair.fromSecret(_props.secretKey);
        _props.transaction.sign(keyPair);
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
     * @return {Promise<number>} The minimum amount left as specified in the configuration.
     */
    async getMinimumAmountLeft(): Promise<number> {
        return config[this.id].dust as number;
    }

    /**
     * Determines the transaction type based on transaction details.
     *
     * @param {TransactionNetwork} tr - The transaction object.
     * @param {string} address - The address to check against.
     * @param {SwapHistoricalTransaction[]} [swapHistorical] - The historical swap transactions.
     * @param {BuySellHistoricalTransaction[]} [buysellHistorical] - The historical buy/sell transactions.
     * @return {TransactionType} The determined transaction type.
     */
    protected determineTransactionType(
        tr: TransactionNetwork,
        address: string,
        swapHistorical?: SwapHistoricalTransaction[],
        buysellHistorical?: BuySellHistoricalTransaction[],
    ): TransactionType {
        const swapTransaction = swapHistorical?.find(
            b => b.hash === tr.hash || b.hash_to === tr.hash,
        );
        if (swapTransaction) {
            tr.swapDetails = formatSwap(swapTransaction);
            return TransactionType.SWAP;
        }
        const buySellTransaction = buysellHistorical?.find(
            b => b.txid === tr.hash,
        );
        if (buySellTransaction) {
            tr.buySellDetails = buySellTransaction;
            return TransactionType.BUYSELL;
        }
        if (tr.tokenTransfers && tr.tokenTransfers.length > 1) {
            const outAmount = tr.tokenTransfers.some(
                a =>
                    a.from === address &&
                    new BigNumber(a.value).isGreaterThan(0),
            );
            const inAmount = tr.tokenTransfers.some(
                a =>
                    a.to === address && new BigNumber(a.value).isGreaterThan(0),
            );
            if (outAmount && inAmount) {
                return TransactionType.TRADE;
            } else if (outAmount) {
                return TransactionType.DEPOSIT;
            } else {
                return TransactionType.WITHDRAW;
            }
        }
        return tr.from?.toLowerCase() === address.toLowerCase()
            ? TransactionType.SEND
            : TransactionType.RECEIVE;
    }
    getPrivateKey({ mnemonic, walletAccount }: GetPrivateKeyParams) {
        const seed = getSeed({
            mnemonic,
        });
        const path = config[this.id].derivations[0].path.replace(
            'ACCOUNT',
            walletAccount.toString(),
        );
        const keyPair = getKeyPair({ path, seed, walletAccount });
        return getPrivateKey({ keyPair });
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

export default StellarWallet;
