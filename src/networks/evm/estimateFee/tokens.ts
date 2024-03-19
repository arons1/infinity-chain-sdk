import { EstimateGasTokenParams, ReturnEstimate } from "./types";
import { calculateGasPrice, getGasLimit, getGasPrice, getNonce } from "./utils";
import ERC20Abi from '@infinity/core-sdk/core/abi/erc20';
import { TransactionEVM } from '@infinity/core-sdk';

/* 
estimateTokenFee
    Returns token transfer estimate cost
    @param amount: Amount to bridge in wei
    @param web3: web3 connector
    @param source: source account to send from
    @param destination: destination account to receive
    @param chainId: chainId
    @param feeRatio: ratio (between 0 and 1) to increase de fee
    @param priorityFee: account index derivation
    @param tokenContract: token contract
*/
export const estimateTokenFee = async ({
    amount = '0',
    web3,
    source,
    destination,
    tokenContract,
    chainId,
    feeRatio = 0.5,
    priorityFee,
}: EstimateGasTokenParams): Promise<ReturnEstimate> => {
    var contract = new web3.eth.Contract(ERC20Abi, tokenContract, {
        from: source,
    });
    const { estimateGas, data } = await getGasLimit({
        source,
        destination,
        tokenContract,
        amount,
        contract,
        web3,
        isToken: true,
    });
    var gasPrice = await getGasPrice({
        web3,
    });
    const nonce = await getNonce({
        address: source,
        web3,
    });
    var transaction:TransactionEVM = {
        from: source,
        nonce: nonce,
        to: tokenContract,
        data,
        value: amount,
    };
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
        gasPrice: transaction.gasPrice ?? transaction.maxFeePerGas,
        transaction,
    };
};