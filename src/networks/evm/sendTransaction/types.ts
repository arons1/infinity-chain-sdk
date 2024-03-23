import { TransactionEVM } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import Web3 from 'web3';

export type SendTransactionParams = {
    connector: Web3;
    transaction: TransactionEVM;
    privateKey: Buffer;
    chain: number;
};
