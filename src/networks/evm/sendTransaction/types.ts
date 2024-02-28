import { TransactionEVM } from '../general/types';

export type SendTransactionParams = {
    web3:any,
    transaction:TransactionEVM,
    privateKey:Buffer,
    chain:number
}