import { TransactionEVM } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { CannotGetNonce } from '../../../errors/networks';
import { EstimateGasParams, ReturnEstimate } from './types';
import { calculateGasPrice, getGasLimit, getGasPrice, getNonce } from './utils';

/* 
estimateCurrencyFee
    Returns currency transfer estimate cost
    @param value: Amount to bridge in wei
    @param web3: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
*/
export const estimateCurrencyFee = async ({
    value = '0',
    web3,
    source,
    destination = '',
    chainId,
    feeRatio,
    priorityFee,
}: EstimateGasParams): Promise<ReturnEstimate> => {
    const { estimateGas } = await getGasLimit({
        source,
        destination,
        value,
        web3,
        chainId,
        isToken: false,
    });
    var gasPrice = await getGasPrice({ web3 });
    var transaction: TransactionEVM = {
        from: source,
        to: destination,
        value: value,
    };
    if (chainId != 100009) {
        transaction.nonce = await getNonce({
            address: source,
            web3,
        });
        if (transaction.nonce == undefined) throw new Error(CannotGetNonce);
    }
    transaction = await calculateGasPrice({
        transaction,
        gasPrice,
        web3,
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
