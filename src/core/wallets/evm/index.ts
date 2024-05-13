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
    TokenTransfer,
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
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
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
    async getTransactions({
        walletName,
        lastTransactionHash,
        startblock,
        swapHistorical
    }: GetTransactionParams): Promise<Transaction[]> {
        let transactions;
        if (this.id == Coins.XDC) {
            transactions = await getTransactionsXDC({
                address: this.getReceiveAddress({
                    walletName: walletName ?? this.walletSelected,
                }),
                lastTransactionHash,
            });
        } else {
            transactions = await getTransactions({
                coinId: this.id,
                address: this.getReceiveAddress({
                    walletName: walletName ?? this.walletSelected,
                }),
                startblock,
            });
        }
        this.setTransactionFormat({ swapHistorical, transactions, walletName });
        return transactions
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

    setTransactionFormat({
        swapHistorical,
        transactions,
        walletName,
        buysellHistorical
    }: SetTransactionFormatParams) {
        const address=this.getReceiveAddress({
            walletName:walletName ?? this.walletSelected
        })
        for(let tr of transactions){
            const isSwap = swapHistorical?.find(b => b.hash == tr.hash || b.hash_to == tr.hash);
            const isBuySell = buysellHistorical?.find(b => b.txid == tr.hash);
            if(isSwap){
                tr.transactionType = TransactionType.SWAP
                tr.swapDetails= {
                    exchange:isSwap.exchange,
                    fromAmount:isSwap.amount,
                    toAmount:isSwap.amount_des,
                    fromCoin:isSwap.from,
                    toCoin:isSwap.to,
                    fromAddress:isSwap.sender_address,
                    toAddress:isSwap.receive_address,
                    hashTo:isSwap.hash_to,
                    hash:isSwap.hash
                } as SwapDetails
            }
            else if(isBuySell){
                tr.transactionType = TransactionType.BUYSELL
                tr.buySellDetails= { ... isBuySell } as BuySellDetails
            }
            else if(tr.tokenTransfers && tr.tokenTransfers?.length >1){
                if(tr.methodId?.toLowerCase()?.includes('withdraw')){
                    tr.transactionType = TransactionType.WITHDRAW
                }
                else if(tr.methodId?.toLowerCase()?.includes('stak')){
                    tr.transactionType = TransactionType.STAKING
                }
                else if(tr.methodId?.toLowerCase()?.includes('deposit') || tr.methodId?.toLowerCase()?.includes('topup')){
                    tr.transactionType = TransactionType.DEPOSIT
                }
                else if(tr.methodId?.toLowerCase()?.includes('addliquid')){
                    tr.transactionType = TransactionType.ADD_LIQUIDY
                }
                else if(tr.methodId?.toLowerCase()?.includes('removeliquid')){
                    tr.transactionType = TransactionType.REMOVE_LIQUIDY
                }
                else if(tr.methodId?.toLowerCase()?.includes('approve')){
                    tr.transactionType = TransactionType.APPROVE
                }
                else{
                    tr.transactionType = TransactionType.TRADE
                }
            }
            else{
                if(tr.from?.toLowerCase()==address.toLowerCase()){
                    tr.transactionType = TransactionType.SEND
                }
                else{
                    tr.transactionType = TransactionType.RECEIVE
                }
            }
        }

    }
}

export default EVMWallet;
