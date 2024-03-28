import {
    Chains,
    TransactionEVM,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { CannotGetNonce } from '../../../errors/networks';
import { EstimateGasParams, ReturnEstimate } from './types';
import { calculateGasPrice, getGasLimit, getGasPrice, getNonce } from './utils';

/* 
estimateCurrencyFee
    Returns currency transfer estimate cost
    @param value: Amount to bridge in wei
    @param connector: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param gasPrice: Gas Price (optional)
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
*/
export const estimateCurrencyFee = async ({
    value = '0',
    connector,
    source,
    destination = '',
    chainId,
    feeRatio,
    priorityFee,
    gasPrice,
}: EstimateGasParams): Promise<ReturnEstimate> => {
    const { estimateGas } = await getGasLimit({
        source,
        destination,
        value,
        connector,
        chainId,
        isToken: false,
    });
    gasPrice = gasPrice ?? (await getGasPrice({ connector }));
    var transaction: TransactionEVM = {
        from: source,
        to: destination,
        value: value,
        gasLimit: estimateGas,
    };
    if (chainId != Chains.VET) {
        transaction.nonce = await getNonce({
            address: source,
            connector,
        });
        if (transaction.nonce == undefined) throw new Error(CannotGetNonce);
    }
    transaction = await calculateGasPrice({
        transaction,
        gasPrice,
        connector,
        chainId,
        feeRatio,
        priorityFee,
    });
    return {
        estimateGas,
        gasPrice,
        transaction,
    };
};
