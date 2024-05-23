import feeAbi from '@infinity/core-sdk/lib/commonjs/core/abi/fee';
import Web3 from 'web3';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { estimateFeeParametersChecker } from '../parametersChecker';
import { CannotEstimateTransaction } from '../../../errors/networks';

/**
 * Estimates L1 Cost
 * @param {Web3} connector Web3 connector
 * @param {string} rawTransaction Raw transaction
 * @returns {Promise<string>} Estimated L1 Cost as string
 */
export const estimateL1Cost = async (
    connector: Web3,
    rawTransaction: string,
): Promise<string> => {
    estimateFeeParametersChecker(connector, rawTransaction);
    const gpo = new connector.eth.Contract(
        feeAbi,
        '0x420000000000000000000000000000000000000F',
    );
    try {
        return new BigNumber(
            await gpo.methods
                .getL1Fee(Buffer.from(rawTransaction, 'hex'))
                .call(),
        ).toString(10);
    } catch (e) {
        console.error(e);
        throw new Error(CannotEstimateTransaction);
    }
};
