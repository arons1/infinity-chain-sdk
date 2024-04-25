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
    publicAddresses?: Record<Protocol, string>;
};
export type LoadPublicNodesParams = {
    protocol: Protocol;
    publicMasterAddress: string;
    change?: number;
    index?: number;
};

export type GetReceiveAddressParams = {
    derivationName?: DerivationName;
    protocol?: Protocol;
};

export type GetChangeAddressParams = {
    derivationName: DerivationName;
    protocol: Protocol;
    changeIndex: number;
};
