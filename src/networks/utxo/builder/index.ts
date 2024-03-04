import axios from 'axios'
import { PROVIDER_TREZOR } from '../../../constants';
import { CoinNotIntegrated } from '../../../errors/networks';

export const buildTransaction = ({
    extendedKey,
    coinId
}) => {
    const selected = PROVIDER_TREZOR[coinId as string] as string;
    if (!selected) throw new Error(CoinNotIntegrated);
    axios.get(PROVIDER_TREZOR[coinId])
}