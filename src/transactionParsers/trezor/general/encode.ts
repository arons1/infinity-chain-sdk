import { GeneralTransactionEncode } from './types';
import { vIn,vOut,Transaction, TokenTransfer } from '../../../networks/types';

export const encode = ({
    transaction,
}: {
    transaction: GeneralTransactionEncode;
}) : Transaction =>  {
    const vIns:vIn[] = []
    const vOuts:vOut[] = []
    
    transaction.vin.map(a => vIns.push({
        address:a.addresses[0],
        n:a.n,
        hex:a.hex,
        sequence:a.sequence,
        txid:a.txid,
        vout:a.vout,
        value:a.value
    }))

    transaction.vout.map(a => vOuts.push({
        address:a.scriptPubKey.addresses[0],
        n:a.n,
        hex:a.scriptPubKey.hex,
        spent:a.spent,
        value:a.value
    }))
    const tokenTransfers:TokenTransfer[] = []
    if(transaction.tokenTransfers != undefined){
        transaction.tokenTransfers.map(a => tokenTransfers.push({
            value:a.value,
            contractAddress:a.token ?? a.contract,
            tokenName:a.name,
            tokenSymbol:a.symbol,
            tokenDecimal:a.decimals,
            from:a.from,
            to:a.to
        }))
    }
    return {
        blockNumber: (transaction.blockheight ?? transaction.blockHeight) as string,
        timeStamp: new Date((transaction.blocktime ?? transaction.blockTime) as string).toISOString(),
        hash: transaction.txid,
        from: transaction.vin[0].addresses[0],
        to: transaction.vout[0].scriptPubKey.addresses[0],
        fee: transaction.fees,
        vIn:vIns,
        tokenTransfers,
        vOut:vOuts,
        confirmations:transaction.confirmations,
        isError:transaction.isError != 0,
        type:transaction.tokenTransfers != undefined ? "evm" : "utxo"
    };
};
