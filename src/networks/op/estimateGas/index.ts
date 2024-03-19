import feeAbi from './general/types';
import { TransactionEVM } from '@infinity/core-sdk';

export const estimateL1Cost = async (web3: any, tx: TransactionEVM) => {
    const gpo = new web3.eth.Contract(
        feeAbi,
        '0x420000000000000000000000000000000000000F',
    );
    return await gpo.methods.getL1Fee(tx).call();
};
