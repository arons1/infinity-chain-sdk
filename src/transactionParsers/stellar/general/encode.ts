import { EffectsEncode, GeneralTransactionEncode } from './types';
import { TokenTransfer, Transaction } from '../../../networks/types';
import BigNumber from 'bignumber.js'

export const encode = ({
    transaction,
    effects,
    account
}: {
    transaction: GeneralTransactionEncode;
    effects: EffectsEncode[];
    account:string
}) : Transaction =>  {
    const operations = transaction.operations
    const tr = transaction.transaction
    const fee = tr.fee_charged
    const from = tr.source_account
    var to = tr.source_account
    const tokenTransfers:TokenTransfer[] = []
    for(let op_id in operations){
        const op = operations[op_id]
        switch(op.type){
            case "create_account":
                const from = op.source_account
                const out = op.account == account ? 0 : 1
                if(from != account && op.account != account)
                    continue;
                var _value = new BigNumber(op.starting_balance).shiftedBy(7)
                if(out == 1 && tr.source_account == account){
                    to = op.account
                    _value = new BigNumber(0)
                }
                tokenTransfers.push({
                    id:op.id,
                    from:op.source_account,
                    to:op.account,
                    value:_value.toString(10)
                })
                break;
            case "manage_buy_offer":
            case "manage_sell_offer":
                tokenTransfers.push({
                    tokenDecimal: 7,
                    id:op.id+"_0",
                    tokenName: op.selling_asset_code,
                    tokenSymbol: op.selling_asset_code,
                    contractAddress: op.selling_asset_issuer,
                    value: new BigNumber(op.amount).multipliedBy(op.price).shiftedBy(7).toString(10),
                    type: op.type,
                    from: account,
                    to: account
                })
                tokenTransfers.push({
                    tokenDecimal: 7,
                    id:op.id+"_1",
                    tokenName: op.buying_asset_code,
                    tokenSymbol: op.buying_asset_code,
                    contractAddress: op.buying_asset_issuer,
                    value: new BigNumber(op.amount).shiftedBy(7).toString(10),
                    type: op.type,
                    from: account,
                    to: account
                })
                break;
            case "path_payment_strict_send":
            case "path_payment_strict_receive":
                if(op.from != account && op.to != account)
                    continue;
                tokenTransfers.push({
                    tokenDecimal: 7,
                    id:op.id+"_0",
                    tokenName: op.source_asset_code,
                    tokenSymbol: op.source_asset_code,
                    contractAddress: op.source_asset_issuer,
                    value: new BigNumber(op.source_amount).shiftedBy(7).toString(10),
                    type: op.type,
                    from: op.from,
                    to: op.to
                })
                tokenTransfers.push({
                    tokenDecimal: 7,
                    id:op.id+"_1",
                    tokenName: op.asset_code,
                    tokenSymbol: op.asset_code,
                    contractAddress: op.asset_issuer,
                    value: new BigNumber(op.amount).shiftedBy(7).toString(10),
                    type: op.type,
                    from: op.from,
                    to: op.to
                })
                break;
            case "create_claimable_balance":
                tokenTransfers.push({
                    tokenDecimal: 7,
                    id:op.id,
                    tokenName: op.asset.toLowerCase().split(':')[0],
                    tokenSymbol: op.asset.toLowerCase().split(':')[0],
                    contractAddress: op.asset.toLowerCase().split(':')[1],
                    value: new BigNumber(op.amount).shiftedBy(7).toString(10),
                    type: op.type,
                    from: op.source_account,
                    to: op.claimants[0]?.destination ?? "Unknow"
                })
                break;
            case "payment":
                tokenTransfers.push({
                    tokenDecimal: 7,
                    id:op.id,
                    tokenName: op.asset_code,
                    tokenSymbol: op.asset_code,
                    contractAddress: op.asset_issuer,
                    value: new BigNumber(op.amount).shiftedBy(7).toString(10),
                    type: op.type,
                    from: op.from,
                    to: op.to
                })
                break;
            case "change_trust":
                tokenTransfers.push({
                    tokenDecimal: 7,
                    id:op.id,
                    tokenName: op.asset_code,
                    tokenSymbol: op.asset_code,
                    contractAddress: op.asset_issuer,
                    value: "0",
                    type: op.type,
                    from: account,
                    to: account
                })
                break;
            case "account_merge":
                const effects_op = effects.filter(a => new BigNumber(op.id).toNumber() ==  new BigNumber(a.id).toNumber())
                for(let ef of effects_op){
                    var value = new BigNumber(ef.amount).shiftedBy(7).toString(10)
                    tokenTransfers.push({
                        tokenDecimal: 7,
                        id:ef.id,
                        tokenName: ef.asset_code,
                        tokenSymbol: ef.asset_code,
                        contractAddress: ef.asset_issuer,
                        value: value,
                        type: op.type,
                        from: op.from,
                        to: op.into
                    })
                }
                break;
                                                    
        }
    }
    const hash = tr.id
    const blockNumber = tr.ledger_attr
    const blockTime = tr.created_at
    
        
    return {
        blockNumber,
        timeStamp: new Date(blockTime as string).toISOString(),
        hash,
        from,
        to,
        fee,
        confirmations:"6",
        isError:false,
        type:"stellar",
        tokenTransfers
    };
};


export const encodeEffects = ({
    effects
}:{effects:any}) => {
    return effects._embedded.records.map((a:any) => {
        return {
            id:a.id.split('-')[0],
            amount:a.amount,
            asset_code:a.asset_code,
            asset_type:a.asset_type
        }
    })
}