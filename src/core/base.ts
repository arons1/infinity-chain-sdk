import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import {
    Coins,
    DerivationName,
    Protocol,
} from '@infinity/core-sdk/lib/commonjs/networks';
import ECDSACoin from '@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import SECP256K1Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/secp256k1';
import { GetReceiveAddressParams } from './type';
abstract class BaseWallet {
    base!: ED25519Coin | SECP256K1Coin | ECDSACoin;
    id!: Coins;
    publicNode!: Record<Protocol, BIP32Interface>;
    account!: string;
    addresses!: Record<
        Protocol,
        Record<DerivationName | string, Record<number, Record<number, string>>>
    >;
    publicAddresses!: Record<Protocol, string>;

    abstract estimateFee(_props: any): any;
    abstract buildTransaction(_props: any): any;
    abstract getBalance(_props: any): any;
    abstract sendTransaction(_props: any): any;
    abstract getTransactions(_props: any): any;
    abstract getAccountBalances(_props: any): any;
    abstract loadConnector(props: any): any;
    abstract getReceiveAddress(props: GetReceiveAddressParams): string;
}

export default BaseWallet;
