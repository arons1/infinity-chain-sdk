import Web3 from 'web3';
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
    TransactionType,
} from '../../../networks/types';
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
import {
    BuySellHistoricalTransaction,
    SwapHistoricalTransaction,
} from '../../types';
import { formatSwap } from '../../utils';

class EVMWallet extends CoinWallet {
    connector!: Web3;
    chain: Chains;
    base!: ECDSACoin;

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
     * Estimates the fee for a transaction based on the provided parameters.
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
     * Builds a transaction using the provided properties.
     *
     * @param {BuildTransaction} _props - The properties for building the transaction.
     * @return {Promise<string>} A promise that resolves to the built transaction.
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
     * Asynchronously signs a transaction using the provided private key and transaction object.
     *
     * @param {SignTransactionParams} params - The parameters for signing the transaction.
     * @param {string} params.privateKey - The private key used to sign the transaction.
     * @param {Transaction} params.transaction - The transaction object to sign.
     * @return {Promise<string>} A promise that resolves to the signed transaction's raw transaction.
     * @throws {Error} If there was an error signing the transaction.
     */
    async signTransaction({
        transaction,
        privateKey,
    }: SignTransactionParams): Promise<string> {
        try {
            const signedTransaction =
                await this.connector.eth.accounts.signTransaction(
                    transaction,
                    privateKey,
                );
            return signedTransaction?.rawTransaction;
        } catch (error) {
            console.error('Error signing transaction:', error);
            throw error;
        }
    }

    /**
     * Signs a message using the provided private key and message.
     *
     * @param {SignMessageParams} params - The parameters for signing the message.
     * @param {string} params.privateKey - The private key used to sign the message.
     * @param {string} params.message - The message to be signed.
     * @return {string} The signature of the signed message.
     */
    signMessage({ privateKey, message }: SignMessageParams): string {
        return this.connector.eth.accounts.sign(message, privateKey).signature;
    }

    /**
     * Retrieves the balances for a given set of accounts or all wallets added using the RPCBalancesParams.
     *
     * @param {RPCBalancesParams} _props - The parameters for retrieving account balances.
     * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
     */
    getAccountBalances(
        _props: RPCBalancesParams,
    ): Promise<Record<string, BalanceResult[]>> {
        const addresses = this.getAddresses(
            _props.walletAccount,
            _props.walletName,
        );
        return getAccountBalances({
            ..._props,
            connector: this.connector,
            accounts: addresses,
        });
    }

    /**
     * Retrieves the balance for a wallet account.
     *
     * @param {Object} options - The options for retrieving the balance.
     * @param {number} options.walletAccount - The account number of the wallet.
     * @param {string} options.walletName - The name of the wallet.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet account.
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
            address: this.getReceiveAddress({ walletAccount, walletName }),
        });
    }

    /**
     * Sends a raw Ethereum transaction using the provided raw transaction string.
     *
     * @param {string} rawTransaction - The raw transaction string to be sent.
     * @return {Promise<string>} A promise that resolves with the transaction hash if successful.
     */
    sendTransaction(rawTransaction: string): Promise<string> {
        return sendTransaction({ rawTransaction, connector: this.connector });
    }

    /**
     * Retrieves transactions based on the specified parameters.
     *
     * @param {GetTransactionParams} params - The parameters for retrieving transactions.
     * @param {number} params.walletAccount - The account number of the wallet to retrieve transactions for.
     * @param {string} params.lastTransactionHash - The hash of the last transaction.
     * @param {number} params.startblock - The start block number for retrieving transactions.
     * @param {boolean} params.swapHistorical - Indicates whether to retrieve historical swaps.
     * @param {string} params.walletName - The name of the wallet to retrieve transactions for.
     * @return {Promise<Transaction[]>} A promise that resolves to an array of transactions.
     */
    async getTransactions({
        walletAccount,
        lastTransactionHash,
        startblock,
        swapHistorical,
        walletName,
    }: GetTransactionParams): Promise<Transaction[]> {
        const address = this.getReceiveAddress({ walletAccount, walletName });
        const transactions =
            this.id == Coins.XDC
                ? await getTransactionsXDC({ address, lastTransactionHash })
                : await getTransactions({
                      coinId: this.id,
                      address,
                      startblock,
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
     * Loads the connector for the EVM wallet.
     *
     * This function initializes a new instance of the Web3 class with the first RPC URL from the config object,
     * using the current wallet's ID as the key. The initialized Web3 instance is then assigned to the `connector` property
     * of the EVM wallet.
     *
     * @return {void} This function does not return a value.
     */
    loadConnector(): void {
        this.connector = new Web3(config[this.id].rpc[0]);
    }

    /**
     * Determines the transaction type based on the provided transaction, address, swap historical, and buy/sell historical.
     *
     * @param {Transaction} tr - The transaction object.
     * @param {string} address - The address to compare with the transaction's "from" address.
     * @param {SwapHistoricalTransaction[]} [swapHistorical] - Optional array of swap historical transactions.
     * @param {BuySellHistoricalTransaction[]} [buysellHistorical] - Optional array of buy/sell historical transactions.
     * @return {TransactionType} The determined transaction type.
     */
    protected determineTransactionType(
        tr: Transaction,
        address: string,
        swapHistorical?: SwapHistoricalTransaction[],
        buysellHistorical?: BuySellHistoricalTransaction[],
    ): TransactionType {
        const swapTransaction = swapHistorical?.find(
            b => b.hash == tr.hash || b.hash_to == tr.hash,
        );
        if (swapTransaction) {
            tr.swapDetails = formatSwap(swapTransaction);
            return TransactionType.SWAP;
        }
        const buySellTransaction = buysellHistorical?.find(
            b => b.txid == tr.hash,
        );
        if (buySellTransaction) {
            tr.buySellDetails = buySellTransaction;
            return TransactionType.BUYSELL;
        }
        if (tr.tokenTransfers && tr.tokenTransfers.length > 1) {
            return this.getTransactionTypeFromMethodId(tr.methodId);
        }
        return tr.from?.toLowerCase() == address.toLowerCase()
            ? TransactionType.SEND
            : TransactionType.RECEIVE;
    }

    /**
     * Determines the transaction type based on the given method ID.
     *
     * @param {string} [methodId] - The method ID to determine the transaction type from.
     * @return {TransactionType} The transaction type corresponding to the method ID. If the method ID is falsy, returns TransactionType.UNKNOWN.
     */
    private getTransactionTypeFromMethodId(methodId?: string): TransactionType {
        if (!methodId) return TransactionType.UNKNOWN;
        const methodIdLower = methodId.toLowerCase();
        if (methodIdLower.includes('withdraw')) return TransactionType.WITHDRAW;
        if (methodIdLower.includes('stak')) return TransactionType.STAKING;
        if (
            methodIdLower.includes('deposit') ||
            methodIdLower.includes('topup')
        )
            return TransactionType.DEPOSIT;
        if (methodIdLower.includes('addliquid'))
            return TransactionType.ADD_LIQUIDY;
        if (methodIdLower.includes('removeliquid'))
            return TransactionType.REMOVE_LIQUIDY;
        if (methodIdLower.includes('approve')) return TransactionType.APPROVE;
        return TransactionType.TRADE;
    }

    /**
     * Retrieves the addresses associated with the given wallet account and name, or all addresses if no parameters are provided.
     *
     * @param {number} [walletAccount] - The wallet account number.
     * @param {string} [walletName] - The name of the wallet.
     * @return {string[]} An array of addresses.
     */
    private getAddresses(
        walletAccount?: number,
        walletName?: string,
    ): string[] {
        if (walletAccount != undefined && walletName != undefined) {
            return [this.getReceiveAddress({ walletAccount, walletName })];
        }
        let addresses: string[] = [];
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
        return addresses;
    }
}

export default EVMWallet;
