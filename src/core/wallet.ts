import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import { Coins, Curve, DerivationName, Protocol } from '@infinity/core-sdk/lib/commonjs/networks';
import Coin from '@infinity/core-sdk/lib/commonjs/networks/coin';
import ECDSACoin from '@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import SECP256K1Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/secp256k1';
import { GetChangeAddressParams, GetReceiveAddressParams, LoadPublicNodesParams, LoadStorageParams } from './type';
import { CannotGeneratePublicAddress, MissingDerivationName, MissingProtocol, NotInitizated } from '../errors/networks';
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
    initializated: boolean = false;
    constructor(id: Coins, mnemonic?: string) {
        super()
        this.id = id;
        this.base = Coin(id);
        if (mnemonic) this.initAddresses(mnemonic);
    }
    getReceiveAddress({
        derivationName,
        protocol
    }: GetReceiveAddressParams): string {
        if(!this.initializated)
            throw new Error(NotInitizated);
        const derivations = config[this.id].derivations
        if(derivations.length == 1){
            return this.addresses[derivations[0].protocol][derivations[0].name][0][0]
        }
        else if(!derivationName){
            throw new Error(MissingDerivationName)
        }
        else if(!protocol){
            throw new Error(MissingProtocol)
        }
        return this.addresses[protocol][derivationName][0][0]
    }
    loadFromStorage({
        account,
        addresses,
        publicAddresses,
    }: LoadStorageParams) {
        if (account) this.account = account;
        if (publicAddresses) this.publicAddresses = publicAddresses;
        this.addresses = addresses;
        this.initializated = true
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
            if(this.id == Coins.FIO)
                this.account = addressResult.account as string;
        }
        this.initializated = true
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
                this.account = address.account
            }
        }
        this.initializated = true
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
}

export default CoinWallet;
