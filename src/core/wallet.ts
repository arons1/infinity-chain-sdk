import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import { Coins, DerivationName, Protocol } from '@infinity/core-sdk/lib/commonjs/networks';
import Coin from '@infinity/core-sdk/lib/commonjs/networks/coin';
import ECDSACoin from '@infinity/core-sdk/lib/commonjs/networks/coin/ecdsa';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import SECP256K1Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/secp256k1';
import { GetReceiveAddressParams, LoadPublicNodesParams, LoadStorageParams } from './type';
import { CannotGeneratePublicAddress, NotInitizated } from '../errors/networks';
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
     /**
     * Retrieves the receive address based on the derivation name and protocol.
     *
     * @param {GetReceiveAddressParams} params - The parameters for retrieving the receive address.
     * @param {string} params.derivationName - The name of the derivation.
     * @param {string} params.protocol - The protocol.
     * @return {string} The receive address.
     * @throws {Error} If the wallet is not initialized or if the receive address cannot be generated.
     */
    getReceiveAddress({
        derivationName,
        protocol,
    }: GetReceiveAddressParams): string {
        if (!this.initializated)
            throw new Error(NotInitizated);
        const derivations = config[this.id].derivations;
        const derivation = derivations.find(d => d.name === derivationName && d.protocol === protocol);
        if (!derivation) {
            if (derivations.length === 1)
                return this.addresses[derivations[0].protocol][derivations[0].name][0][0]
            throw new Error(CannotGeneratePublicAddress)
        }
        return this.addresses[derivation.protocol][derivation.name][0][0]
    }
    /**
     * Loads data from storage into the wallet instance.
     *
     * @param {string} account - The account data to load.
     * @param {Record<Protocol, Record<DerivationName | string, Record<number, Record<number, string>>>>} addresses - The addresses data to load.
     * @param {Record<Protocol, string>} publicAddresses - The public addresses data to load.
     * @return {void} This function does not return anything.
     */
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
    /**
     * Initializes addresses for the wallet using the provided mnemonic.
     *
     * @param {string} mnemonic - The mnemonic used to generate addresses.
     * @return {void} This function does not return anything.
     */
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
        /**
     * Loads public nodes for a given protocol and generates public addresses.
     *
     * @param {LoadPublicNodesParams} param - The parameters for loading public nodes.
     * @param {Protocol} param.protocol - The protocol for which public nodes are being loaded.
     * @param {string} param.publicMasterAddress - The master public address.
     * @param {number} [param.change=0] - The change index.
     * @param {number} [param.index=0] - The index.
     * @throws {Error} Throws an error if public nodes cannot be generated.
     */
    loadPublicNodes({
        protocol, 
        publicMasterAddress, 
        change = 0, 
        index = 0
    }:LoadPublicNodesParams) {
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
                    this.addresses[protocol] = {}
                if(!this.addresses[protocol][derivation.name])
                    this.addresses[protocol][derivation.name] = {}
                if(!this.addresses[protocol][derivation.name][change])
                    this.addresses[protocol][derivation.name][change] = {}
                this.addresses[protocol][derivation.name][change][index] = address.publicAddress as string;
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
