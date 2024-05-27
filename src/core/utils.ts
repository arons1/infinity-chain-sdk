import { Protocol } from '@infinity/core-sdk/lib/commonjs/networks';
import { SwapDetails } from '../networks/types';
import { SwapHistoricalTransaction } from './types';

export const initProtocols: Record<Protocol, any> = {
    [Protocol.LEGACY]: {},
    [Protocol.WRAPPED_SEGWIT]: {},
    [Protocol.SEGWIT]: {},
};
export const formatSwap = (
    swapTransaction: SwapHistoricalTransaction,
): SwapDetails => {
    return {
        exchange: swapTransaction.exchange,
        fromAmount: swapTransaction.amount,
        toAmount: swapTransaction.amount_des,
        fromCoin: swapTransaction.from,
        toCoin: swapTransaction.to,
        fromAddress: swapTransaction.sender_address,
        toAddress: swapTransaction.receive_address,
        hashTo: swapTransaction.hash_to,
        hash: swapTransaction.hash,
    } as SwapDetails;
};
