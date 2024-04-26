import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import {
    Coins,
    DerivationName,
    Protocol
} from '@infinity/core-sdk/lib/commonjs/networks';
import Coin from '@infinity/core-sdk/lib/commonjs/networks/coin';
import {
    GetReceiveAddressParams,
    LoadPublicNodesParams,
    LoadStorageParams,
} from './types';
import { CannotGeneratePublicAddress, NotInitizated } from '../errors/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import BaseWallet from './base';
import { initProtocols } from './utils';

class CoinWallet extends BaseWallet {

    constructor(id: Coins, mnemonic?: string, walletName?:string) {
        super();
        this.id = id;
        this.base = Coin(id);
        this.bipIdCoin = this.base.bipIdCoin
        if (mnemonic && walletName) this.addWallet(mnemonic,walletName);
        else if(mnemonic || walletName) throw Error("You need to pass both mnemonic and walletName or none")
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
        protocol
    }: GetReceiveAddressParams): string {
        if (!this.initializated) throw new Error(NotInitizated);
        const derivations = config[this.id].derivations;
        const derivation = derivations.find(
            d => d.name === derivationName && d.protocol === protocol,
        );
        
        if (!derivation) {
            if (derivations.length === 1)
                return this.addresses[this.walletSelected][derivations[0].protocol][
                    derivations[0].name
                ][0][0];
            throw new Error(CannotGeneratePublicAddress);
        }
        return this.addresses[this.walletSelected][derivation.protocol][derivation.name][0][0];
    }
    /**
     * Loads data from storage into the wallet instance.
     *
     * @param {string} account - The account data to load.
     * @param {Record<Protocol, Record<DerivationName | string, Record<number, Record<number, string>>>>} addresses - The addresses data to load.
     * @param {Record<Protocol, string>} extendedPublicKeys - The public addresses data to load.
     * @return {void} This function does not return anything.
     */
    loadFromStorage({
        account,
        addresses,
        extendedPublicKeys,
        walletName
    }: LoadStorageParams) {
        if (account) this.account[walletName] = account;
        if (extendedPublicKeys) this.extendedPublicKeys[walletName] = extendedPublicKeys;
        this.addresses[walletName] = addresses;
        this.publicNode[walletName] = initProtocols

        if(extendedPublicKeys){
            for(let pb of Object.values(Protocol)){
                this.publicNode[walletName][pb as Protocol] = this.base.importMaster(
                        this.extendedPublicKeys[walletName][pb as Protocol],
                ) as BIP32Interface;
            }
        }
        
        this.initializated = true;
    }
    /**
     * Initializes addresses for the wallet using the provided mnemonic.
     *
     * @param {string} mnemonic - The mnemonic used to generate addresses.
     * @param {string} walletName - The ID of the wallet.
     * @return {void} This function does not return anything.
     */
    addWallet(mnemonic: string, walletName:string) {
        const add = this.base.generateAddresses(mnemonic);
        this.addresses[walletName] = initProtocols
        this.extendedPublicKeys[walletName] = initProtocols
        this.publicNode[walletName] = initProtocols

        for (let addressResult of add) {
            if(addressResult.extendedPublicAddress){
                this.publicNode[walletName][addressResult.protocol] = this.base.importMaster(
                        addressResult.extendedPublicAddress,
                ) as BIP32Interface;
            }
            this.addresses[walletName][addressResult.protocol] = {
                0: { 0: addressResult.publicAddress as string }
            }
            this.extendedPublicKeys[walletName][addressResult.protocol] = addressResult.extendedPublicAddress as string
            if (this.id == Coins.TEZOS)
                this.account[walletName] = addressResult.account as string;
            if (this.id == Coins.FIO)
                this.account[walletName] = addressResult.account as string;
        }
        this.initializated = true;
    }
    /**
     * Sets the selected wallet to the specified wallet name.
     *
     * @param {string} walletName - The name of the wallet to select.
     */
    selectWallet(walletName: string) {
        this.walletSelected = walletName;
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
        index = 0,
        walletName
    }: LoadPublicNodesParams) {
        this.addresses[walletName] = initProtocols
        this.extendedPublicKeys[walletName] = initProtocols
        this.publicNode[walletName] = initProtocols

        this.publicNode[walletName][protocol] = this.base.importMaster(
            publicMasterAddress,
        ) as BIP32Interface;
        if (!this.publicNode[protocol])
            throw new Error(CannotGeneratePublicAddress);
        this.extendedPublicKeys[walletName][protocol] = publicMasterAddress;
        this.addresses[walletName] = initProtocols
        const derivations = config[this.id].derivations.filter(
            a => a.protocol == protocol,
        );
        for (let derivation of derivations) {
            const address = this.base.generatePublicAddresses({
                publicAccountNode: this.publicNode[walletName][protocol],
                derivation: derivation.name,
                change,
                index,
            });
            if (address) {
                if (!this.addresses[walletName][protocol]) this.addresses[walletName][protocol] = {};
                if (!this.addresses[walletName][protocol][derivation.name])
                    this.addresses[walletName][protocol][derivation.name] = {};
                if (!this.addresses[walletName][protocol][derivation.name][change])
                    this.addresses[walletName][protocol][derivation.name][change] = {};
                this.addresses[walletName][protocol][derivation.name][change][index] =
                    address.publicAddress as string;
                this.account[walletName] = address.account;
            }
        }
        this.initializated = true;
    }

    getAccountBalances(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector() {
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
