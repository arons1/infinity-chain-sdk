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
    BuySellDetails,
    CurrencyBalanceResult,
    EstimateFeeResult,
    SwapDetails,
    Transaction,
    TransactionType,
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
import { SetTransactionFormatParams } from '../../types';
import { formatSwap } from '../../utils';
class EVMWallet extends CoinWallet {
    connector!: Web3;
    chain: Chains;
    base!: ECDSACoin;
    /**
     * Constructs a new instance of the class.
     *
     * @param {Coins} id - The ID of the instance.
     * @param {string} [mnemonic] - The mnemonic phrase for the instance.
     * @param {string} [walletAccount] - The ID of the wallet.
     */
    constructor(
        id: Coins,
        mnemonic?: string,
        walletName?: string,
        walletAccount?: number,
    ) {
        super(id, mnemonic, walletName, walletAccount);
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
                walletAccount: _props.walletAccount,
                walletName: _props.walletName,
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
                walletAccount: _props.walletAccount,
                walletName: _props.walletName,
            }),
            connector: this.connector,
            chainId: this.chain,
        });
    }

    /**
     * Signs a transaction using the provided transaction and privateKey.
     *
     * @param {TransactionEVM} transaction - The transaction to sign.
     * @param {string} privateKey - The privateKey used for signing.
     * @return {Promise<string>} A promise that resolves to the signed transaction.
     */
    async signTransaction({
        transaction,
        privateKey,
    }: SignTransactionParams): Promise<string> {
        return (
            await this.connector.eth.accounts.signTransaction(
                transaction,
                privateKey,
            )
        )?.rawTransaction;
    }

    /**
     * Signs a message using the provided privateKey and message.
     *
     * @param {SignMessageParams} param - The parameters for signing the message.
     * @param {string} param.privateKey - The privateKey used for signing the message.
     * @param {string} param.message - The message to sign.
     * @return {string} The signature of the signed message.
     */
    signMessage({ privateKey, message }: SignMessageParams): string {
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
        let addresses: string[] = [];
        if (
            _props.walletAccount != undefined &&
            _props.walletName != undefined
        ) {
            addresses = [
                this.getReceiveAddress({
                    walletAccount: _props.walletAccount,
                    walletName: _props.walletName,
                }),
            ];
        } else {
            Object.keys(this.addresses).map(walletName => {
                Object.keys(this.addresses[walletName]).map(walletAccount => {
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
            connector: this.connector,
            accounts: addresses,
        });
    }

    /**
     * Retrieves the balance for a given wallet account and wallet name.
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
        return getBalance({
            connector: this.connector,
            address: this.getReceiveAddress({
                walletAccount,
                walletName,
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
    async getTransactions({
        walletAccount,
        lastTransactionHash,
        startblock,
        swapHistorical,
        walletName,
    }: GetTransactionParams): Promise<Transaction[]> {
        let transactions;
        if (this.id == Coins.XDC) {
            transactions = await getTransactionsXDC({
                address: this.getReceiveAddress({
                    walletAccount,
                    walletName,
                }),
                lastTransactionHash,
            });
        } else {
            transactions = await getTransactions({
                coinId: this.id,
                address: this.getReceiveAddress({
                    walletAccount,
                    walletName,
                }),
                startblock,
            });
        }
        this.setTransactionFormat({
            swapHistorical,
            transactions,
            walletAccount,
            walletName,
        });
        return transactions;
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

    /**
     * Sets the transaction format for a list of transactions based on their properties and the provided historical data.
     *
     * @param {SetTransactionFormatParams} params - The parameters for setting the transaction format.
     * @param {Array<Transaction>} params.transactions - The list of transactions to set the format for.
     * @param {string} [params.walletAccount] - The name of the wallet. If not provided, the currently selected wallet is used.
     * @param {Array<SwapHistorical>} [params.swapHistorical] - The historical data for swaps.
     * @param {Array<BuySellHistorical>} [params.buysellHistorical] - The historical data for buys and sells.
     */
    setTransactionFormat({
        swapHistorical,
        transactions,
        walletAccount,
        buysellHistorical,
        walletName,
    }: SetTransactionFormatParams) {
        const address = this.getReceiveAddress({
            walletAccount,
            walletName,
        });
        for (let tr of transactions) {
            const swapTransaction = swapHistorical?.find(
                b => b.hash == tr.hash || b.hash_to == tr.hash,
            );
            const buySellTransaction: BuySellDetails | undefined =
                buysellHistorical?.find(b => b.txid == tr.hash);

            if (swapTransaction) {
                tr.transactionType = TransactionType.SWAP;
                tr.swapDetails = formatSwap(swapTransaction);
            } else if (buySellTransaction) {
                tr.transactionType = TransactionType.BUYSELL;
                tr.buySellDetails = buySellTransaction;
            } else if (tr.tokenTransfers && tr.tokenTransfers?.length > 1) {
                if (tr.methodId?.toLowerCase()?.includes('withdraw')) {
                    tr.transactionType = TransactionType.WITHDRAW;
                } else if (tr.methodId?.toLowerCase()?.includes('stak')) {
                    tr.transactionType = TransactionType.STAKING;
                } else if (
                    tr.methodId?.toLowerCase()?.includes('deposit') ||
                    tr.methodId?.toLowerCase()?.includes('topup')
                ) {
                    tr.transactionType = TransactionType.DEPOSIT;
                } else if (tr.methodId?.toLowerCase()?.includes('addliquid')) {
                    tr.transactionType = TransactionType.ADD_LIQUIDY;
                } else if (
                    tr.methodId?.toLowerCase()?.includes('removeliquid')
                ) {
                    tr.transactionType = TransactionType.REMOVE_LIQUIDY;
                } else if (tr.methodId?.toLowerCase()?.includes('approve')) {
                    tr.transactionType = TransactionType.APPROVE;
                } else {
                    tr.transactionType = TransactionType.TRADE;
                }
            } else if (tr.from?.toLowerCase() == address.toLowerCase()) {
                tr.transactionType = TransactionType.SEND;
            } else {
                tr.transactionType = TransactionType.RECEIVE;
            }
        }
    }
}

export default EVMWallet;
