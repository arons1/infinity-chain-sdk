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
import { BuySellHistoricalTransaction, SwapHistoricalTransaction } from '../../types';
import { formatSwap } from '../../utils';

class EVMWallet extends CoinWallet {
    connector!: Web3;
    chain: Chains;
    base!: ECDSACoin;

    constructor(id: Coins, mnemonic?: string, walletName?: string, walletAccount?: number) {
        super(id, mnemonic, walletName, walletAccount);
        this.chain = config[id].chain as Chains;
        this.loadConnector();
    }

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

    async signTransaction({ transaction, privateKey }: SignTransactionParams): Promise<string> {
        try {
            const signedTransaction = await this.connector.eth.accounts.signTransaction(transaction, privateKey);
            return signedTransaction?.rawTransaction;
        } catch (error) {
            console.error('Error signing transaction:', error);
            throw error;
        }
    }

    signMessage({ privateKey, message }: SignMessageParams): string {
        return this.connector.eth.accounts.sign(message, privateKey).signature;
    }

    getAccountBalances(_props: RPCBalancesParams): Promise<Record<string, BalanceResult[]>> {
        const addresses = this.getAddresses(_props.walletAccount, _props.walletName);
        return getAccountBalances({
            ..._props,
            connector: this.connector,
            accounts: addresses,
        });
    }

    getBalance({ walletAccount, walletName }: { walletAccount: number; walletName: string; }): Promise<CurrencyBalanceResult> {
        return getBalance({
            connector: this.connector,
            address: this.getReceiveAddress({ walletAccount, walletName }),
        });
    }

    sendTransaction(rawTransaction: string): Promise<string> {
        return sendTransaction({ rawTransaction, connector: this.connector });
    }

    async getTransactions({ walletAccount, lastTransactionHash, startblock, swapHistorical, walletName }: GetTransactionParams): Promise<Transaction[]> {
        const address = this.getReceiveAddress({ walletAccount, walletName });
        const transactions = this.id == Coins.XDC
            ? await getTransactionsXDC({ address, lastTransactionHash })
            : await getTransactions({ coinId: this.id, address, startblock });

        this.setTransactionFormat({ swapHistorical, transactions, walletAccount, walletName });
        return transactions;
    }

    loadConnector(): void {
        this.connector = new Web3(config[this.id].rpc[0]);
    }

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
            return this.getTransactionTypeFromMethodId(tr.methodId);
        }
        return tr.from?.toLowerCase() == address.toLowerCase() ? TransactionType.SEND : TransactionType.RECEIVE;
    }

    private getTransactionTypeFromMethodId(methodId?: string): TransactionType {
        if (!methodId) return TransactionType.UNKNOWN;
        const methodIdLower = methodId.toLowerCase();
        if (methodIdLower.includes('withdraw')) return TransactionType.WITHDRAW;
        if (methodIdLower.includes('stak')) return TransactionType.STAKING;
        if (methodIdLower.includes('deposit') || methodIdLower.includes('topup')) return TransactionType.DEPOSIT;
        if (methodIdLower.includes('addliquid')) return TransactionType.ADD_LIQUIDY;
        if (methodIdLower.includes('removeliquid')) return TransactionType.REMOVE_LIQUIDY;
        if (methodIdLower.includes('approve')) return TransactionType.APPROVE;
        return TransactionType.TRADE;
    }

    private getAddresses(walletAccount?: number, walletName?: string): string[] {
        if (walletAccount != undefined && walletName != undefined) {
            return [this.getReceiveAddress({ walletAccount, walletName })];
        }
        let addresses: string[] = [];
        Object.keys(this.addresses).forEach(walletName => {
            Object.keys(this.addresses[walletName]).forEach(walletAccount => {
                addresses.push(this.getReceiveAddress({ walletAccount: parseInt(walletAccount), walletName }));
            });
        });
        return addresses;
    }
}

export default EVMWallet;
