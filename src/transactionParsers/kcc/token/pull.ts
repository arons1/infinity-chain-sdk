import { GeneralApiParams } from '../../types';
import { pull as pullEtherscan } from '../../etherscan/token/pull';

export const pull = (props: GeneralApiParams) => {
    return pullEtherscan({ ...props, chainId: 321 });
};
