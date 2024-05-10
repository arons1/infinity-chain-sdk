import CoinWallet from '../../wallet';
import {
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    sendTransaction,
} from '../../../networks/evm';
import {
    BalanceResult,
    CurrencyBalanceResult,
    EstimateFeeResult,
    Transaction,
} from '../../../networks/types';
import Web3 from 'web3';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import {
    BuildTransaction,
    EstimateGasParams,
    GetTransactionParams,
    RPCBalancesParams,
    SignMessageParams,
    SignTransactionParams,
} from './types';
import { Chains } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import ECDSACoin from '@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa';
import { getTransactions as getTransactionsXDC } from '../../../transactionParsers/xdc/get';
import { getTransactions } from '../../../transactionParsers/etherscan/get';
class EVMWallet extends CoinWallet {
    connector!: Web3;
    chain: Chains;
    base!: ECDSACoin;
    /**
     * Constructs a new instance of the class.
     *
     * @param {Coins} id - The ID of the instance.
     * @param {string} [mnemonic] - The mnemonic phrase for the instance.
     * @param {string} [walletName] - The name of the wallet.
     */
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
        const rootNode = this.base.getRootNode(_props.mnemonic);
        const privateAccountNode = this.base.getPrivateMasterKey({ rootNode });
        const privateKey = this.base.getPrivateAddress({ privateAccountNode });
        return buildTransaction({
            ..._props,
            privateKey,
            source: this.getReceiveAddress({
                walletName: _props.walletName ?? this.walletSelected,
            }),
            connector: this.connector,
            chainId: this.chain,
        });
    }

    /**
     * Signs a transaction using the provided transaction and mnemonic.
     *
     * @param {TransactionEVM} transaction - The transaction to sign.
     * @param {string} mnemonic - The mnemonic used for signing.
     * @return {Promise<string>} A promise that resolves to the signed transaction.
     */
    async signTransaction({
        transaction,
        mnemonic,
    }: SignTransactionParams): Promise<string> {
        const rootNode = this.base.getRootNode(mnemonic);
        const privateAccountNode = this.base.getPrivateMasterKey({ rootNode });
        const privateKey = this.base.getPrivateAddress({ privateAccountNode });
        return (
            await this.connector.eth.accounts.signTransaction(
                transaction,
                privateKey,
            )
        )?.rawTransaction;
    }

    /**
     * Signs a message using the provided mnemonic and message.
     *
     * @param {SignMessageParams} param - The parameters for signing the message.
     * @param {string} param.mnemonic - The mnemonic used for signing the message.
     * @param {string} param.message - The message to sign.
     * @return {string} The signature of the signed message.
     */
    signMessage({ mnemonic, message }: SignMessageParams): string {
        const rootNode = this.base.getRootNode(mnemonic);
        const privateAccountNode = this.base.getPrivateMasterKey({ rootNode });
        const privateKey = this.base.getPrivateAddress({ privateAccountNode });
        return this.connector.eth.accounts.sign(message, privateKey).signature;
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
                _props.walletName != undefined
                    ? [
                          this.getReceiveAddress({
                              walletName: _props.walletName,
                          }),
                      ]
                    : Object.keys(this.addresses).map(walletName =>
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
    /**
     * Retrieves transactions based on the specified parameters.
     *
     * @param {GetTransactionParams} params - The parameters for retrieving transactions.
     * @param {string} params.address - The address to retrieve transactions for.
     * @param {string} [params.lastTransactionHash] - The hash of the last transaction. Just for XDC
     * @param {number} [params.startblock] - The start block to retrieve transactions from. Any but for XDC
     * @return {Promise<any>} A promise that resolves to the transactions.
     */
    getTransactions({
        walletName,
        lastTransactionHash,
        startblock,
    }: GetTransactionParams): Promise<Transaction[]> {
        if (this.id == Coins.XDC) {
            return getTransactionsXDC({
                address: this.getReceiveAddress({
                    walletName: walletName ?? this.walletSelected,
                }),
                lastTransactionHash,
            });
        } else {
            return getTransactions({
                coinId: this.id,
                address: this.getReceiveAddress({
                    walletName: walletName ?? this.walletSelected,
                }),
                startblock,
            });
        }
    }
    /**
     * Loads the EVM connector for the specified chain.
     *
     * @return {void} This function does not return anything.
     * @throws {Error} If the chain is not supported.
     */
    loadConnector() {
        this.connector = new Web3(config[this.id].rpc[0]);
    }
}

export default EVMWallet;
