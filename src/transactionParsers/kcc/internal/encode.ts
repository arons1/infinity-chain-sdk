import { Transaction } from '../../../../types';
import { InternalTransactionEncode } from './types';
import {encode as encodeEtherscan} from '../../etherscan/internal/encode'

export const encode = ({
    transaction,
}: {
    transaction: InternalTransactionEncode;
}):Transaction => {
    return encodeEtherscan({transaction})
};
