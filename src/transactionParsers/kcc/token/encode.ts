import { TokenTransactionEncode } from './types';
import { Transaction } from '../../../networks/types';
import { encode as encodeEtherscan } from '../../etherscan/token/encode';

export const encode = ({
    transaction,
}: {
    transaction: TokenTransactionEncode;
}): Transaction => {
    return encodeEtherscan({ transaction });
};
