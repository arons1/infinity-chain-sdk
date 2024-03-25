import {
    Transaction,
    TransactionEVM,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';
import feeAbi from '@infinity/core-sdk/lib/commonjs/core/abi/fee';
import Web3 from 'web3';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
/* 
estimateL1Cost
    Returns estimate L1Cost
    @param connector: web3 connector
    @param tx: TransactionEVM
*/
export const estimateL1Cost = async (
    connector: Web3,
    tx: TransactionEVM,
): Promise<string> => {
    const gpo = new connector.eth.Contract(
        feeAbi,
        '0x420000000000000000000000000000000000000F',
    );
    const txBuilder = new Transaction(tx).serialize();
    return new BigNumber(await gpo.methods.getL1Fee(txBuilder).call()).toString(
        10,
    );
};
