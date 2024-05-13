import {
    DerivationName,
    Protocol,
} from '@infinity/core-sdk/lib/commonjs/networks';
import { Transaction } from '../networks/types';

export type LoadStorageParams = {
    account?: string;
    addresses: Record<
        Protocol,
        Record<DerivationName, Record<number, Record<number, string>>>
    >;
    extendedPublicKeys?: Record<Protocol, string>;
    walletName: string;
};
export type LoadPublicNodesParams = {
    protocol: Protocol;
    publicMasterAddress: string;
    change?: number;
    index?: number;
    walletName: string;
};

export type GetReceiveAddressParams = {
    derivationName?: DerivationName;
    protocol?: Protocol;
    walletName?: string;
};

export type GetChangeAddressParams = {
    derivationName: DerivationName;
    protocol: Protocol;
    changeIndex: number;
    walletName?: string;
};


export type SwapHistoricalTransaction = {
    id: number;
    id_transaction: string;
    id_user: string;
    hash: string;
    fixed: number;
    from: string;
    to: string;
    amount: number;
    amount_des: number;
    exchange_address: string;
    receive_address: string;
    sender_address: string;
    time: number;
    exchange: string;
    status: string;
    hash_to: string;
    is_fixed: boolean;
};
export type BuySellHistoricalTransaction = {
    idService: string;
    walletAddress: string;
    createdAt: string;
    status: string;
    fiatCurrency: string;
    userId: string;
    cryptoCurrency: string;
    isBuyOrSell: string;
    fiatAmount: number;
    cryptoAmount: number;
    network: string;
    txid: string;
    provider: string;
    coinId: string;
    fiatTransactionId: string;
}
export type SetTransactionFormatParams = {
    transactions:Transaction[];
    swapHistorical?:SwapHistoricalTransaction[];
    walletName?:string
    buysellHistorical?:BuySellHistoricalTransaction[]
}