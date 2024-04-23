import { BIP32Interface } from "@infinity/core-sdk/lib/commonjs/core/bip32";
import { Coins, Protocol } from "@infinity/core-sdk/lib/commonjs/networks";
import ECDSACoin from "@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa";
import ED25519Coin from "@infinity/core-sdk/lib/commonjs/networks/coin/ed25519";
import SECP256K1Coin from "@infinity/core-sdk/lib/commonjs/networks/coin/secp256k1";
import { LoadStorageParams, LoadPublicNodesParams } from "../type";
import CoinWallet from "../wallet";

class EVMWallet implements CoinWallet {
    base: ED25519Coin | SECP256K1Coin | ECDSACoin;
    id: Coins;
    publicNode: Record<Protocol, BIP32Interface>;
    account: string;
    addresses: Record<Protocol, Record<string, Record<number, Record<number, string>>>>;
    publicAddresses: Record<Protocol, string>;
    loadFromStorage(props: LoadStorageParams): void {
        return this.loadFromStorage(props)
    }
    initAddresses(mnemonic: string): void {
        throw new Error("Method not implemented.");
    }
    loadPublicNodes({ protocol, publicMasterAddress, change, index }: LoadPublicNodesParams): void {
        throw new Error("Method not implemented.");
    }
    estimateFee(_props: any) {
        throw new Error("Method not implemented.");
    }
    buildTransaction(_props: any) {
        throw new Error("Method not implemented.");
    }
    getBalance(_props: any) {
        throw new Error("Method not implemented.");
    }
    sendTransaction(_props: any) {
        throw new Error("Method not implemented.");
    }
    getTransactions(_props: any) {
        throw new Error("Method not implemented.");
    }
    
}