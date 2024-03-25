import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

export const hasManager = (manager: any) => {
    return manager && typeof manager === 'object' ? !!manager.key : !!manager;
};
export function formatOpParamsBeforeSend(params: any) {
    if (params.kind === 'origination' && params.script) {
        const newParams = { ...params, ...params.script };
        newParams.init = newParams.storage;
        delete newParams.script;
        delete newParams.storage;
        return newParams;
    } else if (params.kind == 'transaction') {
        if (params.destination) params.to = params.destination;
        if (
            (params.mutez === null || params.mutez === undefined) &&
            !(params.amount + '').includes('.')
        ) {
            params.mutez = true;
        }
        params.amount = new BigNumber(params.amount).toNumber();
    }
    return params;
}
