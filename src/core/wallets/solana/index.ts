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
    BuySellDetails,
    CurrencyBalanceResult,
    EstimateFeeResult,
    SwapDetails,
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
import { SetTransactionFormatParams } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

class SolanaWallet extends CoinWallet {
    connector!: Connection;
    base!: ED25519Coin;
    /**
     * Constructs a new instance of the SolanaWallet class.
     *
     * @param {Coins} id - The ID of the wallet.
     * @param {string} [mnemonic] - The mnemonic phrase for the wallet.
     * @param {string} [walletName] - The name of the wallet.
     */
    constructor(id: Coins, mnemonic?: string, walletName?: string) {
        super(id, mnemonic, walletName);
        this.loadConnector();
    }

    /**
     * Estimates the fee for a transaction.
     *
     * @param {VersionedTransaction | Transaction} transaction - The transaction object.
     * @return {Promise<EstimateFeeResult>} A promise that resolves to the estimated fee.
     */
    estimateFee(props: EstimateFeeParams): Promise<EstimateFeeResult> {
        return estimateFee({
            ...props,
            connector: this.connector,
            publicKey: new PublicKey(
                this.addresses[props.walletName ?? this.walletSelected][
                    Protocol.LEGACY
                ],
            ),
        });
    }
    /**
     * Builds a transaction using the provided parameters.
     *
     * @param {string} _props.memo - The transaction's memo.
     * @param {PublicKey} _props.publicKey - The sender's public key.
     * @param {string} _props.destination - The transaction's destination address.
     * @param {string} _props.value - The transaction's value.
     * @param {string} [_props.fee] - The transaction's fee.
     * @param {string} [_props.gasPrice] - The transaction's gas price.
     * @param {string} [_props.gasLimit] - The transaction's gas limit.
     * @param {string} [_props.nonce] - The transaction's nonce.
     * @param {string} [_props.data] - The transaction's data.
     * @param {KeyPair} _props.keyPair - The key pair of the sender.
     * @return {Promise<string>} A promise that resolves to the transaction ID.
     */
    buildTransaction(_props: TransactionBuilderParams): Promise<string> {
        const seed = this.base.getSeed({
            mnemonic: _props.mnemonic,
        });
        const keyPair = this.base.getKeyPair({
            seed,
        });
        return buildTransaction({
            ..._props,
            keyPair,
            connector: this.connector,
        });
    }
    /**
     * Retrieves the balance for the wallet.
     *
     * @param {string} walletName - The name of the wallet for which to retrieve the balance.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance(walletName?: string): Promise<CurrencyBalanceResult> {
        return getBalance({
            connector: this.connector,
            address: this.getReceiveAddress({
                walletName: walletName ?? this.walletSelected,
            }),
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
            connector: this.connector,
            accounts:
                walletName != undefined
                    ? [this.getReceiveAddress({ walletName })]
                    : Object.keys(this.addresses).map(a =>
                          this.getReceiveAddress({ walletName: a }),
                      ),
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
     * @param {string} [params.walletName] - (Optional) The name of the wallet to retrieve transactions for. If not provided, the transactions of the currently selected wallet will be retrieved.
     * @param {string[]} [params.signatures] - (Optional) An array of transaction signatures.
     * @param {string[]} [params.accounts] - (Optional) An array of account addresses.
     * @return {Promise<TransactionNetwork[]>} A promise that resolves to an array of transactions.
     */
    async getTransactions({
        walletName,
        signatures,
        accounts,
        swapHistorical,
    }: GetTransactionsParams): Promise<TransactionNetwork[]> {
        const transactions = await getTransactions({
            address: this.getReceiveAddress({
                walletName: walletName ?? this.walletSelected,
            }),
            connector: this.connector,
            signatures,
            accounts,
        });
        this.setTransactionFormat({
            swapHistorical,
            transactions,
            walletName,
        });
        return transactions;
    }
    /**
     * Signs a transaction using the provided transaction and mnemonic.
     *
     * @param {SignTransactionParams} params - The parameters for signing the transaction.
     * @param {Transaction} params.transaction - The transaction to sign.
     * @param {string} params.mnemonic - The mnemonic used for signing.
     * @return {Promise<VersionedTransaction | Transaction>} A promise that resolves to the signed transaction.
     */
    signTransaction({
        transaction,
        mnemonic,
    }: SignTransactionParams): Promise<VersionedTransaction | Transaction> {
        const seed = this.base.getSeed({
            mnemonic,
        });
        const keyPair = this.base.getKeyPair({
            seed,
        });
        return signTransaction({
            transaction,
            keyPair,
            coinId: this.id,
        });
    }
    /**
     * Signs a message using the provided mnemonic and message.
     *
     * @param {string} message - The message to sign.
     * @param {string} mnemonic - The mnemonic used for signing.
     * @return {Uint8Array} The signed message.
     */
    signMessage({ message, mnemonic }: SignMessageParams): Uint8Array {
        const seed = this.base.getSeed({
            mnemonic,
        });
        const keyPair = this.base.getKeyPair({
            seed,
        });
        return sign({ message, secretKey: keyPair.secretKey });
    }

    /**
     * Retrieves the balance after a transaction.
     *
     * @param {transaction} _props.transaction - The transaction to be confirmed.
     * @param {string} _props.walletName - The name of the wallet to use for retrieving the balance after the transaction. If not specified, the wallet currently selected in the wallet store will be used.
     * @return {Promise<Record<string, DataBalance>>} A promise that resolves to a record of string keys and DataBalance values representing the balance after the transaction.
     */
    getBalanceAfter(_props: {
        transaction: Transaction;
        walletName?: string;
    }): Promise<Record<string, DataBalance>> {
        return getBalanceAfter({
            transaction: _props.transaction,
            connector: this.connector,
            signer: this.getReceiveAddress({
                walletName: _props.walletName ?? this.walletSelected,
            }),
        });
    }
    /**
     * Checks if the API RPC for the specified bipIdCoin is defined, throws an error if not, and initializes the connector with the corresponding connection.
     *
     * @return {void} This function does not return anything.
     */
    loadConnector() {
        this.connector = new Connection(config[this.id].rpc[0]);
    }

    async getMinimumAmountLeftCall(): Promise<number> {
        try {
            return await this.connector.getMinimumBalanceForRentExemption(0);
        } catch (e) {}
        return 890880;
    }
    getMinimumAmountLeft = pMemoize(
        async () => await this.getMinimumAmountLeftCall(),
        {
            maxAge: 600_000,
        },
    );
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

export default SolanaWallet;
