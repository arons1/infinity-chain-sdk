import { EstimateFeeParams } from './types';

export const estimateFee = ({ api }: EstimateFeeParams): number | null => {
    return api.getState().fee.last;
};
