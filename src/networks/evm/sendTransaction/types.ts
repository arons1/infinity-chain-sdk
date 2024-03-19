import Web3 from 'web3';
import { TransactionEVM } from '../general/types';

export type SendTransactionParams = {
    web3: Web3;
    transaction: TransactionEVM;
    privateKey: Buffer;
    chain: number;
};
