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
import { BuildTransaction, EstimateGasParams, RPCBalancesParams } from './types';
import { Chains } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { UnsupportedChainId } from '../../../errors/transactionParsers';

class EVMWallet extends CoinWallet {
    connector!: Web3;
    chain: Chains;
    constructor(id: Coins, mnemonic?: string) {
        super(id,mnemonic);
        this.chain = config[id].chain as Chains
    }
    estimateFee(_props: EstimateGasParams): Promise<EstimateFeeResult> {
        return estimateFee({
            ..._props,
            source: this.getReceiveAddress({}),
            connector: this.connector,
            chainId: this.chain,
        });
    }
    buildTransaction(_props: BuildTransaction): Promise<string> {
        return buildTransaction({
            ..._props,
            source: this.getReceiveAddress({}),
            connector: this.connector,
            chainId: this.chain,
        });
    }
    getAccountBalances(
        _props: RPCBalancesParams,
    ): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances({
            ..._props,
            connector: this.connector,
            accounts:Object.keys(this.addresses)
        });
    }
    getBalance(): Promise<CurrencyBalanceResult> {
        return getBalance({
            connector: this.connector,
            address: this.getReceiveAddress({}),
        });
    }
    sendTransaction(rawTransaction:string): Promise<string> {
        return sendTransaction({
            rawTransaction,
            connector: this.connector,
        });
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector() {
        if(PROVIDERS[this.chain] == undefined){
            throw new Error(UnsupportedChainId);
        }
        this.connector = new Web3(PROVIDERS[this.chain])
    }
}

export default EVMWallet;
