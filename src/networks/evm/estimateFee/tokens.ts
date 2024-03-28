import { EstimateGasTokenParams, ReturnEstimate } from './types';
import { calculateGasPrice, getGasLimit, getGasPrice, getNonce } from './utils';
import ERC20Abi from '@infinity/core-sdk/lib/commonjs/core/abi/erc20';
import { CannotGetNonce } from '../../../errors/networks';
import {
    Chains,
    TransactionEVM,
} from '@infinity/core-sdk/lib/commonjs/networks/evm';

/* 
estimateTokenFee
    Returns token transfer estimate cost
    @param value: value to bridge in wei
    @param connector: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
    @param tokenContract: token contract
    @param gasPrice: Gas Price (optional)
*/
export const estimateTokenFee = async ({
    value = '0',
    connector,
    source,
    destination,
    gasPrice,
    tokenContract,
    chainId,
    feeRatio = 0.5,
    priorityFee,
    approve = false,
}: EstimateGasTokenParams): Promise<ReturnEstimate> => {
    var contract = new connector.eth.Contract(ERC20Abi, tokenContract, {
        from: source,
    });
    const { estimateGas, data } = await getGasLimit({
        source,
        destination,
        tokenContract,
        value,
        contract,
        chainId,
        connector,
        isToken: true,
        approve,
    });
    gasPrice =
        gasPrice ??
        (await getGasPrice({
            connector,
        }));

    var transaction: TransactionEVM = {
        from: source,
        to: tokenContract,
        data,
        gasLimit: estimateGas,
        value: value,
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
        gasPrice: transaction.gasPrice ?? transaction.maxFeePerGas,
        transaction,
    };
};
