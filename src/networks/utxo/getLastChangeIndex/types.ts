import { Protocol } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import { TrezorWebsocket } from '../trezorWebsocket';

export type LastChangeIndexParameters = {
    extendedPublicKey: string;
    connector: TrezorWebsocket;
};
type TokensChangeIndex = {
    name: string;
    path: string;
    transfers: number;
    decimals: number;
};
export type ChangeIndexResult = {
    address: string;
    balance: string;
    totalReceived: string;
    totalSent: string;
    unconfirmedBalance: string;
    unconfirmedTxs: number;
    txs: number;
    addrTxCount: number;
    usedTokens: number;
    tokens: TokensChangeIndex[];
};
export type ChangeIndexResolve = {
    index: number;
    protocol: Protocol;
};
