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
    CurrencyBalanceResult,
    EstimateFeeResult,
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
import { BuySellHistoricalTransaction, SwapHistoricalTransaction } from '../../types';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { formatSwap } from '../../utils';

class TezosWallet extends CoinWallet {
    connector!: TezosToolkit;
    base!: ED25519Coin;

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
     * Estimates the fee for a transaction on the Tezos blockchain.
     *
     * @param {EstimateFeeParams} _props - The parameters for estimating the fee.
     * @returns {Promise<EstimateFeeResult>} - A promise that resolves to the estimated fee result.
     */
    estimateFee(_props: EstimateFeeParams): Promise<EstimateFeeResult> {
        const { walletAccount, walletName } = _props;
        return estimateFee({
            ..._props,
            pkHash: this.account[walletName][walletAccount],
            source: this.getReceiveAddress({ walletAccount, walletName }),
            connector: this.connector,
        });
    }

    /**
     * Builds a transaction using the provided parameters.
     *
     * @param {BuildTransactionParams} _props - The parameters for building the transaction.
     * @return {Promise<BuildTransactionResult>} - A promise that resolves to the built transaction.
     */
    buildTransaction(_props: BuildTransactionParams): Promise<BuildTransactionResult> {
        const privateKey = getPrivateKey({ keyPair: _props.keyPair });
        const pkHash = getTezosPublicKeyHash({ keyPair: _props.keyPair });
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
     * @param {Object} params - The parameters for retrieving the balance.
     * @param {string} params.walletName - The name of the wallet.
     * @param {number} params.walletAccount - The account number of the wallet.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance({ walletAccount, walletName }: { walletName: string; walletAccount: number; }): Promise<CurrencyBalanceResult> {
        return getBalance({
            address: this.getReceiveAddress({ walletAccount, walletName }),
        });
    }

    /**
     * Retrieves the balances for a given set of accounts or all wallets added using the RPCBalancesParams.
     *
     * @param {GetAccountBalancesParams} _props - The parameters for retrieving account balances.
     * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
     */
    getAccountBalances(_props: GetAccountBalancesParams): Promise<Record<string, BalanceResult[]>> {
        const { walletAccount, walletName } = _props;
        let addresses: string[] = [];
        if (walletAccount !== undefined && walletName !== undefined) {
            addresses = [this.getReceiveAddress({ walletAccount, walletName })];
        } else {
            Object.keys(this.addresses).forEach(walletName => {
                Object.keys(this.addresses[walletName]).forEach(walletAccount => {
                    addresses.push(
                        this.getReceiveAddress({
                            walletAccount: parseInt(walletAccount),
                            walletName,
                        }),
                    );
                });
            });
        }
        return getAccountBalances({
            ..._props,
            accounts: addresses,
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
        const pkHash = getTezosPublicKeyHash({ keyPair: _props.keyPair });
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
     * @return {Promise<Transaction[]>} A promise that resolves to an array of transactions.
     */
    async getTransactions({
        walletAccount,
        lastTransactionHash,
        swapHistorical,
        walletName,
    }: GetTransactionsParams): Promise<Transaction[]> {
        const transactions = await getTransactions({
            address: this.getReceiveAddress({ walletAccount, walletName }),
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
     * Loads the connector for the Tezos wallet based on the specified BIP ID coin.
     *
     * @throws {Error} If the API RPC for the BIP ID coin is not defined.
     */
    loadConnector() {
        this.connector = new TezosToolkit(config[this.id].rpc[0]);
    }

    /**
     * Retrieves the public key hash for a given wallet account and wallet name.
     *
     * @param {Object} options - The options for retrieving the public key hash.
     * @param {string} options.walletName - The name of the wallet.
     * @param {number} options.walletAccount - The account number of the wallet.
     * @return {string} The public key hash associated with the wallet account and wallet name.
     */
    getPublickeyHash({ walletAccount, walletName }: { walletName: string; walletAccount: number; }): string {
        return this.account[walletName][walletAccount];
    }

    /**
     * Signs a transaction using the provided parameters.
     *
     * @param {SignTransactionParams} _props - The parameters for signing the transaction.
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
     * @return {Uint8Array} The signed message.
     */
    signMessage(_props: SignMessageParams): Uint8Array {
        return sign({
            secretKey: _props.secretKey,
            message: _props.message,
        });
    }

    /**
     * Determines the type of a transaction.
     *
     * @param {Transaction} tr - The transaction to determine the type of.
     * @param {string} address - The address involved in the transaction.
     * @param {SwapHistoricalTransaction[]} [swapHistorical] - Optional array of swap historical transactions.
     * @param {BuySellHistoricalTransaction[]} [buysellHistorical] - Optional array of buy/sell historical transactions.
     * @return {TransactionType} The determined transaction type.
     */
    protected determineTransactionType(tr: Transaction, address: string, swapHistorical?: SwapHistoricalTransaction[], buysellHistorical?: BuySellHistoricalTransaction[]): TransactionType {
        const swapTransaction = swapHistorical?.find(b => b.hash == tr.hash || b.hash_to == tr.hash);
        if (swapTransaction) {
            tr.swapDetails = formatSwap(swapTransaction);
            return TransactionType.SWAP;
        }
        const buySellTransaction = buysellHistorical?.find(b => b.txid == tr.hash);
        if (buySellTransaction) {
            tr.buySellDetails = buySellTransaction;
            return TransactionType.BUYSELL;
        }
        if (tr.tokenTransfers && tr.tokenTransfers.length > 1) {
            const outAmount = tr.tokenTransfers.some(a => a.from === address && new BigNumber(a.value).isGreaterThan(0));
            const inAmount = tr.tokenTransfers.some(a => a.to === address && new BigNumber(a.value).isGreaterThan(0));
            if (outAmount && inAmount) {
                return TransactionType.TRADE;
            } else if (outAmount) {
                return TransactionType.DEPOSIT;
            } else {
                return TransactionType.WITHDRAW;
            }
        }
        return tr.from?.toLowerCase() === address.toLowerCase() ? TransactionType.SEND : TransactionType.RECEIVE;
    }
}

export default TezosWallet;
