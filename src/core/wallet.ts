import { BIP32Interface } from "@infinity/core-sdk/lib/commonjs/core/bip32";
import { Coins, Protocol } from "@infinity/core-sdk/lib/commonjs/networks";
import Coin from "@infinity/core-sdk/lib/commonjs/networks/coin";
import ECDSACoin from "@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa";
import ED25519Coin from "@infinity/core-sdk/lib/commonjs/networks/coin/ed25519";
import SECP256K1Coin from "@infinity/core-sdk/lib/commonjs/networks/coin/secp256k1";
import config from "@infinity/core-sdk/lib/commonjs/networks/config";
import { AddressResult } from "@infinity/core-sdk/lib/commonjs/networks/types";
import { extractPath } from "@infinity/core-sdk/lib/commonjs/utils";

abstract class CoinWallet {
    base: ED25519Coin | SECP256K1Coin | ECDSACoin;
    id: Coins;
    publicNode!: Record<Protocol, BIP32Interface>;
    account!: string;
    addresses:Record<Protocol,AddressResult[]>;
    constructor(id:Coins,mnemonic:string){
        this.id = id;
        this.base = Coin(id);
        this.initAddresses(mnemonic);
    }
    initAddresses(mnemonic:string){
        const add = this.base.generateAddresses(mnemonic)
        for(let addressResult of add){
            this.addresses = addressResult.publicAddress as string
            if(this.id == Coins.TEZOS){
                this.account = add[0].account as string
            }
        }
    }
    abstract estimateFee(_props: any): any;
    abstract buildTransaction(_props: any): any;
    abstract getBalance(_props: any): any;
    abstract sendTransaction(_props: any): any;
    abstract getTransactions(_props: any): any;   
}

export default CoinWallet