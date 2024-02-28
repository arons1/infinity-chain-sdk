import { Transaction } from '../../../../types';
import { GeneralTransactionEncode } from './types';
import {encode as encodeEtherscan} from '../../etherscan/general/encode'


export const encode = ({
    transaction,
}: {
    transaction: GeneralTransactionEncode;
}):Transaction => {
    return encodeEtherscan({transaction})
};
