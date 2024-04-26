import {
    DerivationName,
    Protocol,
} from '@infinity/core-sdk/lib/commonjs/networks';

export type LoadStorageParams = {
    account?: string;
    addresses: Record<
        Protocol,
        Record<DerivationName, Record<number, Record<number, string>>>
    >;
    extendedPublicKeys?: Record<Protocol, string>;
    walletName:string
};
export type LoadPublicNodesParams = {
    protocol: Protocol;
    publicMasterAddress: string;
    change?: number;
    index?: number;
    walletName:string
};

export type GetReceiveAddressParams = {
    derivationName?: DerivationName;
    protocol?: Protocol;
    walletName?:string

};

export type GetChangeAddressParams = {
    derivationName: DerivationName;
    protocol: Protocol;
    changeIndex: number;

};
