import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import { Coins, Curve, DerivationName, Protocol } from '@infinity/core-sdk/lib/commonjs/networks';
import Coin from '@infinity/core-sdk/lib/commonjs/networks/coin';
import ECDSACoin from '@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import SECP256K1Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/secp256k1';
import { LoadPublicNodesParams, LoadStorageParams } from './type';
import { CannotGeneratePublicAddress } from '../errors/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import BaseWallet from './base';

class CoinWallet extends BaseWallet {


    base: ED25519Coin | SECP256K1Coin | ECDSACoin;
    id: Coins;
    publicNode!: Record<Protocol, BIP32Interface>;
    account!: string;
    addresses!: Record<Protocol, Record<DerivationName | string,Record<number, Record<number, string>>>>;
    publicAddresses!: Record<Protocol, string>;
    constructor(id: Coins, mnemonic?: string) {
        super()
        this.id = id;
        this.base = Coin(id);
        if (mnemonic) this.initAddresses(mnemonic);
    }
    getAccountBalances(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector(_props: any) {
        throw new Error(NotImplemented);
    }
    estimateFee(_props: any) {
        throw new Error(NotImplemented);
    }
    buildTransaction(_props: any) {
        throw new Error(NotImplemented);
    }
    getBalance(_props: any) {
        throw new Error(NotImplemented);
    }
    sendTransaction(_props: any) {
        throw new Error(NotImplemented);
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }

    loadFromStorage({
        account,
        addresses,
        publicAddresses,
    }: LoadStorageParams) {
        if (account) this.account = account;
        if (publicAddresses) this.publicAddresses = publicAddresses;
        this.addresses = addresses;
    }
    initAddresses(mnemonic: string) {
        const add = this.base.generateAddresses(mnemonic);
        for (let addressResult of add) {
            this.addresses[addressResult.protocol] = {
                0: { 0: addressResult.publicAddress as string },
            };
            this.publicAddresses[addressResult.protocol] =
                addressResult.extendedPublicAddress as string;
            if (this.id == Coins.TEZOS)
                this.account = addressResult.account as string;
        }
    }
    loadPublicNodes({
        protocol, 
        publicMasterAddress, 
        change = 0, 
        index = 0
    }:LoadPublicNodesParams) {
        if(config[this.id].curve == Curve.ED25519)
            throw new Error(NotImplemented)
        this.publicNode[protocol] = this.base.importMaster(
            publicMasterAddress,
        ) as BIP32Interface;
        if (!this.publicNode[protocol])
            throw new Error(CannotGeneratePublicAddress);
        this.publicAddresses[protocol] = publicMasterAddress
        const derivations = config[this.id].derivations.filter(a => a.protocol == protocol)
        for(let derivation of derivations){
            const address = this.base.generatePublicAddresses({publicAccountNode:this.publicNode[protocol],derivation:derivation.name,change,index})
            if(address){
                if(!this.addresses[protocol])
                    this.addresses[protocol] = {[derivation.name]:{[change]: { [index]: address.publicAddress as string }}}
                else
                    this.addresses[protocol][derivation.name] = {
                        [change]: { [index]: address.publicAddress as string },
                    };
            }
        }
    
    }
}

export default CoinWallet;
