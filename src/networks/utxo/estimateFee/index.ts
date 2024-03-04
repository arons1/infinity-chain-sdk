import axios from 'axios'
import { PROVIDER_TREZOR } from '../../../constants';
import { EstimateFeeParams } from './types';
import { CannotGetUTXO, CoinNotIntegrated } from '../../../errors/networks';
import { MissingExtendedKey } from '../../../errors/transactionParsers';

export const getUTXO = ({
    extendedPublicKey,
    coinId
}:EstimateFeeParams) => {
    return new Promise((resolve,reject) => {
        axios.get(PROVIDER_TREZOR[coinId]+"api/v2/utxo/"+extendedPublicKey)
        .then(a => {
            resolve(a.data)
        })
        .catch(e => {
            console.error(e)
            reject(e)
        })
    })
}

export const estimateFee = async ({
    extendedPublicKeys,
    coinId
}:EstimateFeeParams) => {
    if(extendedPublicKeys ==undefined || extendedPublicKeys.length == 0) throw new Error(MissingExtendedKey);
    const selected = PROVIDER_TREZOR[coinId as string] as string;
    if (!selected) throw new Error(CoinNotIntegrated);
    const utxos = []
    for(let extendedPublicKey)
    try{
        const utxos = await getUTXO({extendedPublicKey,coinId})

    }
    catch(e){
        console.error(e)
        throw new Error(CannotGetUTXO)

    }

}