import { Protocol } from '@infinity/core-sdk/lib/commonjs/networks';

export const initProtocols: Record<Protocol, any> = {
    [Protocol.LEGACY]: {},
    [Protocol.WRAPPED_SEGWIT]: {},
    [Protocol.SEGWIT]: {},
};
