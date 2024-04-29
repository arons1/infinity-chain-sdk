import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import {
    CoinIds,
    Coins,
    DerivationName,
    Protocol,
} from '@infinity/core-sdk/lib/commonjs/networks';
import ECDSACoin from '@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import SECP256K1Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/secp256k1';
import { GetReceiveAddressParams } from './types';
abstract class BaseWallet {
    base!: ED25519Coin | SECP256K1Coin | ECDSACoin;
    id!: Coins;
    publicNode: Record<string, Record<Protocol, BIP32Interface>> = {};
    account: Record<string, string> = {};
    addresses: Record<
        string,
        Record<
            Protocol,
            Record<
                DerivationName | string,
                Record<number, Record<number, string>>
            >
        >
    > = {};
    extendedPublicKeys: Record<string, Record<Protocol, string>> = {};
    initializated: boolean = false;
    bipIdCoin!: CoinIds;
    walletSelected: string = '';
    abstract selectWallet(walleName: string): any;
    abstract estimateFee(_props: any): any;
    abstract buildTransaction(_props: any): any;
    abstract getBalance(_props: any): any;
    abstract sendTransaction(_props: any): any;
    abstract getTransactions(_props: any): any;
    abstract getAccountBalances(_props: any): any;
    abstract loadConnector(): any;
    abstract getReceiveAddress(props: GetReceiveAddressParams): string;
    abstract removeWallet(walletName: string): any;
    abstract isValidAddress(address: string): boolean;
}

export default BaseWallet;
