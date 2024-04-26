import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
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
} from '../../../networks/types';
import CoinWallet from '../../wallet';
import { API_RPCS } from '../../config';
import { UnsupportedChainId } from '../../../errors/transactionParsers';
import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import { GetBalanceAfterParams, SignMessageParams, SignTransactionParams, TransactionBuilderParams } from './types';
import { sign, signTransaction } from '@infinity/core-sdk/lib/commonjs/networks/ed25519';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import { DataBalance } from '../../../networks/solana/getBalanceAfter/types';

class SolanaWallet extends CoinWallet {
    connector!:Connection;
    base!: ED25519Coin;
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
    estimateFee(transaction: VersionedTransaction | Transaction): Promise<EstimateFeeResult> {
        return estimateFee({
            transaction,
            connector: this.connector
        });
    }
    /**
     * Builds a transaction using the provided parameters.
     *
     * @param {TransactionBuilderParams} _props - The transaction parameters.
     * @return {Promise<string>} A promise that resolves to the transaction ID.
     */
    buildTransaction(_props: TransactionBuilderParams): Promise<string> {
        const seed = this.base.getSeed({
            mnemonic: _props.mnemonic
        })
        const keyPair = this.base.getKeyPair({
            seed
        })
        return buildTransaction({
            ..._props,
            keyPair,
            connector: this.connector
        });
    }
    /**
     * Retrieves the balance for the wallet.
     *
     * @param {string} walletName - The name of the wallet for which to retrieve the balance.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance(walletName?:string): Promise<CurrencyBalanceResult> {
        return getBalance({
            connector: this.connector,
            address: this.getReceiveAddress({
                walletName: walletName ?? this.walletSelected,
            })
        });
    }
    /**
     * Retrieves the balances for a given set of accounts or all wallets added using the RPCBalancesParams.
     *
     * @param {string[]} [accounts] - The accounts to retrieve balances for. If not provided, balances for all wallets will be retrieved.
     * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
     */
    getAccountBalances(accounts?:string[]): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances({
            connector: this.connector,
            accounts: accounts ?? Object.keys(this.addresses).map(walletName =>
                this.getReceiveAddress({ walletName }),
            )
        });
    }
    /**
     * Sends a transaction with a raw buffer to the connected wallet.
     *
     * @param {Buffer} rawTransaction - The raw transaction buffer to send.
     * @return {Promise<string>} A promise that resolves to the transaction ID.
     */
    sendTransaction(rawTransaction:Buffer): Promise<string> {
        return sendTransaction({
            rawTransaction,
            connector: this.connector
        });
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
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
        mnemonic
    }:SignTransactionParams): Promise<VersionedTransaction | Transaction> {
        const seed = this.base.getSeed({
            mnemonic
        })
        const keyPair = this.base.getKeyPair({
            seed
        })
        return signTransaction({
            transaction,
            keyPair,
            coinId:this.id
        })
    }
    /**
     * Signs a message using the provided mnemonic and message.
     *
     * @param {string} message - The message to sign.
     * @param {string} mnemonic - The mnemonic used for signing.
     * @return {Uint8Array} The signed message.
     */
    signMessage({
        message,
        mnemonic
    }:SignMessageParams): Uint8Array {
        const seed = this.base.getSeed({
            mnemonic
        })
        const keyPair = this.base.getKeyPair({
            seed
        })
        return sign({message,secretKey:keyPair.secretKey});
    }

    /**
     * Retrieves the balance after a transaction.
     *
     * @param {GetBalanceAfterParams} _props - The parameters for retrieving the balance after a transaction.
     * @return {Promise<Record<string, DataBalance>>} A promise that resolves to a record of string keys and DataBalance values representing the balance after the transaction.
     */
    getBalanceAfter(_props:GetBalanceAfterParams) : Promise<Record<string, DataBalance>>{
        return getBalanceAfter({
            transaction:_props.transaction,
            connector: this.connector,
            signer: this.getReceiveAddress({walletName:  _props.walletName ?? this.walletSelected})
        })
    }
    /**
     * Checks if the API RPC for the specified bipIdCoin is defined, throws an error if not, and initializes the connector with the corresponding connection.
     *
     * @return {void} This function does not return anything.
     */
    loadConnector() {
        if (API_RPCS[this.bipIdCoin] == undefined) {
            throw new Error(UnsupportedChainId);
        }
        this.connector = new Connection(API_RPCS[this.bipIdCoin]);
    }
}

export default SolanaWallet;
