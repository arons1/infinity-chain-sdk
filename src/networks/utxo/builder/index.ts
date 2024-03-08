import { PROVIDER_TREZOR } from '../../../constants';
import { CannotGetFeePerByte, CannotGetUTXO, CoinNotIntegrated, ErrorBuildingUTXOTransaction, InvalidAmount } from '../../../errors/networks';
import { DUST } from '../constant';
import { getFeePerByte } from '../estimateFee';
import { getUTXO } from '../getUTXO';
import { UTXOResult } from '../getUTXO/types';
import BigNumber from 'bignumber.js';
import { BuildParameters } from './types';
import { networks,utils,getRedeemP2WPKH,getPublicAddressP2WPKHP2S,getPublicAddressP2PKH,getPublicAddressSegwit } from '@infinity/core-sdk'
import bitcoinjs from 'bitcoinjs-lib'
import { getLastChangeIndex } from '../getLastChangeIndex';



export const buildTransaction = async ({
    extendedPublicKeys,
    coinId, 
    amount,
    trezorWebsocket,
    privateAccountNode,
    destination,
    memo = '',
    changeIndex = -1,
    utxos = []
}:BuildParameters) => {
    const selected = PROVIDER_TREZOR[coinId as string] as string;
    const network = networks[coinId as string];

    if (!selected) throw new Error(CoinNotIntegrated);
    if(amount.includes('.')) throw new Error(InvalidAmount)
    // 1º Get UTXOs
    if(utxos.length == 0){
        for(let extendedPublicKey of extendedPublicKeys)
        try{
            const utxos_address = await getUTXO({extendedPublicKey,trezorWebsocket})
            utxos = [...utxos_address,...utxos]
        }
        catch(e){
            console.error(e)
            throw new Error(CannotGetUTXO)
        }
    }

    utxos = utxos.sort((a,b)=>a.path > b.path ? -1 : 1)
    var amountLeft = new BigNumber(amount)
    // 2º Select all UTXO necesary to fill the amount
    const utxosUsed:UTXOResult[] = []
    var feeAcc = new BigNumber(78)
    if(memo.length > 0)
        feeAcc = feeAcc.plus(memo.length)
    let feePerByte
    // 5º Get fee per byte
    try{
        feePerByte = await getFeePerByte({trezorWebsocket})
    }
    catch(e){
        console.error(e)
        throw new Error(CannotGetFeePerByte)
    }
    var tx = new bitcoinjs.TransactionBuilder(network);

    for(let utxo of utxos){
        amountLeft = amountLeft.minus(utxo.value)
        if(utxo.protocol == 84)
            feeAcc = feeAcc.plus(68)
        else
            feeAcc = feeAcc.plus(148)

        utxosUsed.push(utxo)
        tx.addInput(utxo.txid, utxo.vout, new BigNumber("0xfffffffd").toNumber());
        if(!amountLeft.plus(feeAcc.multipliedBy(feePerByte)).isGreaterThan(0)){
            break;
        }
    }
    // 3º Get the fee of inputs
    const feeInput = utxosUsed.reduce((v,p) => {
        if(v.protocol)
            return new BigNumber(68).plus(p)
        return new BigNumber(148).plus(p)
    },new BigNumber(0))
    var feeOutput = new BigNumber(34)
    
    tx.addOutput(destination,amount);
    // 4º Add input if it needs a change address
    if(!amountLeft.plus(feeAcc.multipliedBy(feePerByte)).isGreaterThanOrEqualTo(0)){
        const changeAmount = amountLeft.plus(feeAcc.multipliedBy(feePerByte)).multipliedBy(-1)
        if(changeAmount.isGreaterThan(DUST[coinId])){
            feeOutput = feeOutput.plus(34)
            var lastChangeIndex = changeIndex
            if(lastChangeIndex == -1)
                lastChangeIndex = await getLastChangeIndex({
                    extendedPublicKey:extendedPublicKeys[0],
                    trezorWebsocket
                })
            let addressChange
            if(extendedPublicKeys[0].startsWith('ypub')){
                addressChange = getPublicAddressP2WPKHP2S({
                    publicAccountNode:privateAccountNode,
                    change:1,
                    index:lastChangeIndex,
                    network
                })
            }
            else if(extendedPublicKeys[0].startsWith('xpub')){
                addressChange = getPublicAddressP2PKH({
                    publicAccountNode:privateAccountNode,
                    change:1,
                    index:lastChangeIndex,
                    network
                })
            }
            else{
                addressChange = getPublicAddressSegwit({
                    publicAccountNode:privateAccountNode,
                    change:1,
                    index:lastChangeIndex,
                    network
                })
            }
            tx.addOutput(addressChange,changeAmount.toString(10));
        }
    }
    if(memo.length > 0){
        feeOutput = feeOutput.plus(memo.length)
        tx.addOutput(bitcoinjs.script.compile(
            [
              bitcoinjs.opcodes.OP_RETURN,
              Buffer.from(memo)
            ]), 0)
    }

    for(var k = 0;k < utxosUsed.length;k++){
        const unspent = utxosUsed[k]
        const [change,index] = unspent.path.split('/').slice(4)
        const keyPair = utils.getPrivateKey({privateAccountNode,change,index})
        if(unspent.protocol == 84){
            tx.sign({
                prevOutScriptType: 'p2wpkh',
                vin: k,
                keyPair: keyPair,
                witnessValue: unspent.value
            })
        }
        else if (unspent.protocol == 49) {
            const redem = getRedeemP2WPKH({publicKey:keyPair.publicKey,network})
            tx.sign({
                prevOutScriptType: 'p2sh-p2wpkh',
                vin: k,
                keyPair: keyPair,
                redeemScript: redem,
                witnessValue: unspent.value,
            })
        }
        else {
            tx.sign(k, keyPair);
        }
    }
    let hex
    try{
        hex = tx.build().toHex();
    }
    catch(e){
        console.error(e)
        throw new Error(ErrorBuildingUTXOTransaction)
    }
    return {
        feePerByte,
        utxos,
        hex,
        utxosUsed,
        transactionSize:feeInput.plus(feeOutput).toString(10)
    }
}