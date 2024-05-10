import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
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
        const seed = this.base.getSeed({ mnemonic: _props.mnemonic });
        const keyPair = this.base.getKeyPair({ seed });
        const privateKey = getPrivateKey({ keyPair });
        const pkHash = getTezosPublicKeyHash({
            keyPair,
        });
        const source = this.base.getPublicAddress({ keyPair });
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
        const seed = this.base.getSeed({ mnemonic: _props.mnemonic });
        const keyPair = this.base.getKeyPair({ seed });
        const privateKey = getPrivateKey({ keyPair });
        const pkHash = getTezosPublicKeyHash({
            keyPair,
        });
        const source = this.base.getPublicAddress({ keyPair });
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
    getTransactions({
        walletName,
        lastTransactionHash,
    }: GetTransactionsParams): Promise<Transaction[]> {
        return getTransactions({
            address: this.getReceiveAddress({
                walletName: walletName ?? this.walletSelected,
            }),
            lastTransactionHash,
        });
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
     * @param {string} _props.mnemonic - The mnemonic used for signing.
     * @return {Promise<string>} - A promise that resolves to the signed transaction.
     */
    signTransaction(_props: SignTransactionParams): Promise<string> {
        const seed = this.base.getSeed({ mnemonic: _props.mnemonic });
        const keyPair = this.base.getKeyPair({ seed });
        return signTransaction({
            ..._props,
            keyPair,
            coinId: this.id,
        });
    }

    /**
     * Signs a message using the provided mnemonic and message.
     *
     * @param {SignMessageParams} _props - The parameters for signing the message.
     * @param {string} _props.mnemonic - The mnemonic used for signing.
     * @param {string} _props.message - The message to sign.
     * @return {Uint8Array} The signed message.
     */
    signMessage(_props: SignMessageParams): Uint8Array {
        const seed = this.base.getSeed({ mnemonic: _props.mnemonic });
        const secretKey = this.base.getSecretKey({
            seed,
        });
        return sign({
            secretKey,
            message: _props.message,
        });
    }
}

export default TezosWallet;
