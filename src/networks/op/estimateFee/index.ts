import {
    Transaction,
    TransactionEVM,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';
import feeAbi from '@infinity/core-sdk/lib/commonjs/core/abi/fee';
import Web3 from 'web3';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

export const estimateL1Cost = async (
    connector: Web3,
    tx: TransactionEVM,
): Promise<string> => {
    const gpo = new web3.eth.Contract(
        feeAbi,
        '0x420000000000000000000000000000000000000F',
    );
    const txBuilder = new Transaction(tx).serialize();
    return new BigNumber(await gpo.methods.getL1Fee(txBuilder).call()).toString(
        10,
    );
};
