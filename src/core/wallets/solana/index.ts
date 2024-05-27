import {
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    getBalanceAfter,
    sendTransaction,
} from '../../../networks/solana';

import {
    BalanceResult,
    CurrencyBalanceResult,
    EstimateFeeResult,
    Transaction as TransactionNetwork,
    TransactionType,
} from '../../../networks/types';
import CoinWallet from '../../wallet';
import {
    Connection,
    PublicKey,
    Transaction,
    VersionedTransaction,
} from '@solana/web3.js';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import {
    EstimateFeeParams,
    GetTransactionsParams,
    SignMessageParams,
    SignTransactionParams,
    TransactionBuilderParams,
} from './types';
import {
    sign,
    signTransaction,
} from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import { Coins, Protocol } from '@infinity/core-sdk/lib/commonjs/networks';
import { DataBalance } from '../../../networks/solana/getBalanceAfter/types';
import pMemoize from 'p-memoize';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { getTransactions } from '../../../transactionParsers/solana/get';
import {
    BuySellHistoricalTransaction,
    SwapHistoricalTransaction,
} from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { formatSwap } from '../../utils';

class SolanaWallet extends CoinWallet {
    connector!: Connection;
    base!: ED25519Coin;

    /**
     * Constructs a new instance of the SolanaWallet class.
     *
     * @param {Coins} id - The ID of the wallet.
     * @param {string} [mnemonic] - The mnemonic phrase for the wallet.
     * @param {string} [walletName] - The name of the wallet.
     * @param {number} [walletAccount] - The account number of the wallet.
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
     * @param {EstimateFeeParams} props - The transaction details for fee estimation.
     * @return {Promise<EstimateFeeResult>} A promise that resolves to the estimated fee.
     */
    estimateFee(props: EstimateFeeParams): Promise<EstimateFeeResult> {
        return estimateFee({
            ...props,
            connector: this.connector,
            publicKey: new PublicKey(
                this.addresses[props.walletAccount][Protocol.LEGACY],
            ),
        });
    }

    /**
     * Builds a transaction using the provided parameters.
     *
     * @param {TransactionBuilderParams} props - The transaction parameters.
     * @return {Promise<string>} A promise that resolves to the transaction ID.
     */
    buildTransaction(props: TransactionBuilderParams): Promise<string> {
        return buildTransaction({
            ...props,
            connector: this.connector,
        });
    }

    /**
     * Retrieves the balance for the wallet.
     *
     * @param {Object} params - The parameters for retrieving the balance.
     * @param {number} params.walletAccount - The account number of the wallet.
     * @param {string} params.walletName - The name of the wallet.
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
            connector: this.connector,
            address: this.getReceiveAddress({
                walletAccount,
                walletName,
            }),
        });
    }

    /**
     * Retrieves the balances for a given set of accounts or all wallets added using the RPCBalancesParams.
     *
     * @param {Object} params - The parameters for retrieving account balances.
     * @param {string} params.walletName - The name of the wallet to retrieve balances for.
     * @param {number} params.walletAccount - The account to retrieve balances for. If not provided, balances for all wallets will be retrieved.
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
            connector: this.connector,
            accounts: addresses,
        });
    }

    /**
     * Sends a transaction with a raw buffer to the connected wallet.
     *
     * @param {Buffer} rawTransaction - The raw transaction buffer to send.
     * @return {Promise<string>} A promise that resolves to the transaction ID.
     */
    sendTransaction(rawTransaction: Buffer): Promise<string> {
        return sendTransaction({
            rawTransaction,
            connector: this.connector,
        });
    }

    /**
     * Retrieves transactions based on the specified parameters.
     *
     * @param {GetTransactionsParams} params - The parameters for retrieving transactions.
     * @return {Promise<TransactionNetwork[]>} A promise that resolves to an array of transactions.
     */
    async getTransactions({
        walletAccount,
        signatures,
        accounts,
        swapHistorical,
        walletName,
    }: GetTransactionsParams): Promise<TransactionNetwork[]> {
        const transactions = await getTransactions({
            address: this.getReceiveAddress({
                walletAccount,
                walletName,
            }),
            connector: this.connector,
            signatures,
            accounts,
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
     * Signs a transaction using the provided transaction and keyPair.
     *
     * @param {SignTransactionParams} params - The parameters for signing the transaction.
     * @return {Promise<VersionedTransaction | Transaction>} A promise that resolves to the signed transaction.
     */
    signTransaction({
        transaction,
        keyPair,
    }: SignTransactionParams): Promise<VersionedTransaction | Transaction> {
        return signTransaction({
            transaction,
            keyPair,
            coinId: this.id,
        });
    }

    /**
     * Signs a message using the provided keyPair and message.
     *
     * @param {SignMessageParams} params - The parameters for signing the message.
     * @return {Uint8Array} The signed message.
     */
    signMessage({ message, keyPair }: SignMessageParams): Uint8Array {
        return sign({
            message,
            secretKey: keyPair.secretKey,
        });
    }

    /**
     * Retrieves the balance after a transaction.
     *
     * @param {Object} props - The parameters for retrieving the balance after the transaction.
     * @param {Transaction} props.transaction - The transaction to be confirmed.
     * @param {number} props.walletAccount - The account number of the wallet.
     * @param {string} props.walletName - The name of the wallet.
     * @return {Promise<Record<string, DataBalance>>} A promise that resolves to a record of balances after the transaction.
     */
    getBalanceAfter({
        transaction,
        walletAccount,
        walletName,
    }: {
        transaction: Transaction;
        walletAccount: number;
        walletName: string;
    }): Promise<Record<string, DataBalance>> {
        return getBalanceAfter({
            transaction,
            connector: this.connector,
            signer: this.getReceiveAddress({
                walletAccount,
                walletName,
            }),
        });
    }

    /**
     * Initializes the connector with the corresponding connection.
     *
     * @return {void} This function does not return anything.
     */
    loadConnector() {
        this.connector = new Connection(config[this.id].rpc[0]);
    }

    async getMinimumAmountLeftCall(): Promise<number> {
        try {
            return await this.connector.getMinimumBalanceForRentExemption(0);
        } catch (e) {
            console.error(e);
        }
        return 890880; // default value if RPC call fails
    }

    getMinimumAmountLeft = pMemoize(
        async () => await this.getMinimumAmountLeftCall(),
        {
            maxAge: 600_000, // cache result for 10 minutes
        },
    );

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
}

export default SolanaWallet;
