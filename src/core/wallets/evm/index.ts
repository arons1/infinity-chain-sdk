import CoinWallet from '../../wallet';
import {
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    sendTransaction,
} from '../../../networks/evm';
import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import {
    BalanceResult,
    CurrencyBalanceResult,
    EstimateFeeResult,
} from '../../../networks/types';
import Web3 from 'web3';
import { PROVIDERS } from '../../config';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import {
    BuildTransaction,
    EstimateGasParams,
    RPCBalancesParams,
} from './types';
import { Chains } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { UnsupportedChainId } from '../../../errors/transactionParsers';

class EVMWallet extends CoinWallet {
    connector!: Web3;
    chain: Chains;
    constructor(id: Coins, mnemonic?: string, walletName?: string) {
        super(id, mnemonic, walletName);
        this.chain = config[id].chain as Chains;
        this.loadConnector();
    }
    /**
     * Estimates the fee for a transaction using the provided parameters.
     *
     * @param {EstimateGasParams} _props - The parameters for estimating the fee.
     * @return {Promise<EstimateFeeResult>} A promise that resolves to the estimated fee result.
     */
    estimateFee(_props: EstimateGasParams): Promise<EstimateFeeResult> {
        return estimateFee({
            ..._props,
            source: this.getReceiveAddress({
                walletName: _props.walletName ?? this.walletSelected,
            }),
            connector: this.connector,
            chainId: this.chain,
        });
    }
    /**
     * Builds a transaction using the provided parameters.
     *
     * @param {BuildTransaction} _props - The transaction parameters.
     * @return {Promise<string>} A promise that resolves to the transaction ID.
     */
    buildTransaction(_props: BuildTransaction): Promise<string> {
        return buildTransaction({
            ..._props,
            source: this.getReceiveAddress({
                walletName: _props.walletName ?? this.walletSelected,
            }),
            connector: this.connector,
            chainId: this.chain,
        });
    }

    /**
     * Retrieves the balances for a given set of accounts or all wallets added using the RPCBalancesParams.
     *
     * @param {RPCBalancesParams} _props - The parameters for retrieving account balances.
     * @param {string[]} _props.accounts - The accounts to retrieve balances for.
     * @param {string[]} _props.contracts - The contracts of the tokens to retrieve balances for.
     * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
     */
    getAccountBalances(
        _props: RPCBalancesParams,
    ): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances({
            ..._props,
            connector: this.connector,
            accounts:
                _props.accounts ??
                Object.keys(this.addresses).map(walletName =>
                    this.getReceiveAddress({ walletName }),
                ),
        });
    }
    /**
     * Retrieves the balance for the wallet.
     *
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
     * Sends a raw transaction to the EVM blockchain.
     *
     * @param {string} rawTransaction - The raw transaction to send.
     * @return {Promise<string>} A promise that resolves to the transaction hash.
     */
    sendTransaction(rawTransaction: string): Promise<string> {
        return sendTransaction({
            rawTransaction,
            connector: this.connector,
        });
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    /**
     * Loads the EVM connector for the specified chain.
     *
     * @return {void} This function does not return anything.
     * @throws {Error} If the chain is not supported.
     */
    loadConnector() {
        if (PROVIDERS[this.chain] == undefined) {
            throw new Error(UnsupportedChainId);
        }
        this.connector = new Web3(PROVIDERS[this.chain]);
    }
}

export default EVMWallet;
