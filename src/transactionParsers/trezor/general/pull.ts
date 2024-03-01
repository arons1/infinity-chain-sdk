import { PROVIDER } from '../constants';
import { GeneralApiParams } from '../../types';
import { MissingAddress, MissingCoinId, MissingExtendedKey } from '../../../errors/transactionParsers';

export const pull = ({
    coinId,
    address,
    page,
    limit
}: GeneralApiParams) => {
    if(!coinId) throw new Error(MissingCoinId)
    if(coinId != "eth"){
        if(!address) throw new Error(MissingExtendedKey)
    }
    else{
        if(!address) throw new Error(MissingAddress)
    }
    const selected = PROVIDER[coinId as string] as string;
    if (!selected) throw new Error('Not integrated coin');
    if(coinId == "eth"){
        return selected + "/api/v2/address/" + address + "?details=txs&page=" + page+"&pageSize="+limit
    }
    return selected + "/api/xpub/" + address + "?details=txs&page=" + page+"&pageSize="+limit;
};
