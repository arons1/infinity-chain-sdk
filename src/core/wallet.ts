import { BIP32Interface } from '@infinity/core-sdk/lib/commonjs/core/bip32';
import {
    Coins,
    DerivationName,
    Protocol,
} from '@infinity/core-sdk/lib/commonjs/networks';
import Coin from '@infinity/core-sdk/lib/commonjs/networks/coin';
import {
    GetReceiveAddressParams,
    LoadPublicNodesParams,
    LoadStorageParams,
} from './types';
import {
    CannotGeneratePublicAddress,
    WalletAndNameNotFound,
} from '../errors/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import BaseWallet from './base';
import { initProtocols } from './utils';

class CoinWallet extends BaseWallet {
    /**
     * Constructs a new instance of the class.
     *
     * @param {Coins} id - The ID of the instance.
     * @param {string} [mnemonic] - The mnemonic phrase for the instance.
     * @param {string} [walletAccount] - The ID of the wallet.
     */
    constructor(
        id: Coins,
        mnemonic?: string,
        walletName?: string,
        walletAccount?: number,
    ) {
        super();
        this.id = id;
        this.base = Coin(id);
        this.bipIdCoin = this.base.bipIdCoin;

        if (
            mnemonic &&
            mnemonic.length > 0 &&
            walletAccount != undefined &&
            walletName &&
            walletName.length > 0
        )
            this.addWallet(mnemonic, walletName, walletAccount);
        else if (mnemonic && (walletName || walletAccount))
            throw Error(WalletAndNameNotFound);
    }
    /**
     * Retrieves the receive address based on the derivation name and protocol.
     *
     * @param {GetReceiveAddressParams} params - The parameters for retrieving the receive address.
     * @param {DerivationName } params.derivationName - The name of the derivation.
     * @param {Protocol} params.protocol - The protocol.
     * @return {string} The receive address.
     * @throws {Error} If the wallet is not initialized or if the receive address cannot be generated.
     */
    getReceiveAddress({
        derivationName = DerivationName.LEGACY,
        protocol = Protocol.LEGACY,
        walletAccount,
        walletName,
    }: GetReceiveAddressParams): string {
        let derivation;
        if (config[this.id].derivations.length > 1) {
            derivation = config[this.id].derivations.find(
                d => d.name === derivationName && d.protocol === protocol,
            );
        } else {
            derivation = config[this.id].derivations[0];
        }

        if (derivation == undefined)
            throw new Error(CannotGeneratePublicAddress);
        return this.addresses[walletName][walletAccount ?? this.walletSelected][
            derivation.protocol
        ][derivation.name][0][0];
    }
    /**
     * Removes a wallet from the addresses, publicNode, and extendedPublicKeys objects.
     *
     * @param {string} walletAccount - The name of the wallet to remove.
     */
    removeWallet(walletAccount: number) {
        delete this.addresses[walletAccount];
        delete this.publicNode[walletAccount];
        delete this.extendedPublicKeys[walletAccount];
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
        walletAccount,
        walletName,
    }: LoadStorageParams) {
        if (!this.addresses[walletName]) this.addresses[walletName] = {};
        this.addresses[walletName][walletAccount] = { ...initProtocols };
        if (!this.publicNode[walletName]) this.publicNode[walletName] = {};
        this.publicNode[walletName][walletAccount] = { ...initProtocols };
        if (!this.extendedPublicKeys[walletName])
            this.extendedPublicKeys[walletName] = {};
        this.extendedPublicKeys[walletName][walletAccount] = {
            [Protocol.LEGACY]: '',
            [Protocol.SEGWIT]: '',
            [Protocol.WRAPPED_SEGWIT]: '',
        };
        if (!this.account[walletName]) this.account[walletName] = {};
        if (account) this.account[walletName][walletAccount] = account;
        if (extendedPublicKeys)
            this.extendedPublicKeys[walletName][walletAccount] =
                extendedPublicKeys;
        this.addresses[walletName][walletAccount] = addresses;

        if (extendedPublicKeys) {
            for (let pb of Object.values(Protocol)) {
                this.publicNode[walletName][walletAccount][pb as Protocol] =
                    this.base.importMaster(
                        this.extendedPublicKeys[walletName][walletAccount][
                            pb as Protocol
                        ],
                    ) as BIP32Interface;
            }
        }

        this.initializated = true;
    }
    /**
     * Initializes addresses for the wallet using the provided mnemonic.
     *
     * @param {string} mnemonic - The mnemonic used to generate addresses.
     * @param {number} walletAccount - The ID of the wallet.
     * @return {void} This function does not return anything.
     */
    addWallet(mnemonic: string, walletName: string, walletAccount: number) {
        if (!this.addresses[walletName]) this.addresses[walletName] = {};
        this.addresses[walletName][walletAccount] = { ...initProtocols };
        if (!this.publicNode[walletName]) this.publicNode[walletName] = {};
        this.publicNode[walletName][walletAccount] = { ...initProtocols };
        if (!this.extendedPublicKeys[walletName])
            this.extendedPublicKeys[walletName] = {};
        this.extendedPublicKeys[walletName][walletAccount] = {
            [Protocol.LEGACY]: '',
            [Protocol.SEGWIT]: '',
            [Protocol.WRAPPED_SEGWIT]: '',
        };
        const add = this.base.generateAddresses(mnemonic, walletAccount);
        for (let addressResult of add) {
            if (addressResult.publicAddress != undefined)
                this.addresses[walletName][walletAccount][
                    addressResult.protocol
                ] = {
                    [addressResult.derivationName]: {
                        0: {
                            0: addressResult.publicAddress,
                        },
                    },
                };
            this.extendedPublicKeys[walletName][walletAccount][
                addressResult.protocol
            ] = addressResult.extendedPublicAddress as string;
            if (this.id === Coins.TEZOS || this.id === Coins.FIO)
                this.account[walletAccount] = addressResult.account as string;
            if (addressResult.extendedPublicAddress != undefined) {
                const extendedKeys: BIP32Interface | void =
                    this.base.importMaster(
                        addressResult.extendedPublicAddress + '',
                    );
                if (extendedKeys)
                    this.publicNode[walletName][walletAccount][
                        addressResult.protocol
                    ] = extendedKeys;
            }
        }
        this.initializated = true;
    }
    /**
     * Sets the selected wallet to the specified wallet name.
     *
     * @param {number} walletAccount - The ID of the wallet to select.
     */
    selectWallet(walletAccount: number) {
        this.walletSelected = walletAccount;
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
        walletAccount,
        walletName,
    }: LoadPublicNodesParams) {
        if (!this.addresses[walletName]) this.addresses[walletName] = {};
        this.addresses[walletName][walletAccount] = { ...initProtocols };
        if (!this.publicNode[walletName]) this.publicNode[walletName] = {};
        this.publicNode[walletName][walletAccount] = { ...initProtocols };
        if (!this.extendedPublicKeys[walletName])
            this.extendedPublicKeys[walletName] = {};
        this.extendedPublicKeys[walletName][walletAccount] = {
            [Protocol.LEGACY]: '',
            [Protocol.SEGWIT]: '',
            [Protocol.WRAPPED_SEGWIT]: '',
        };
        this.publicNode[walletName][walletAccount][protocol] =
            this.base.importMaster(publicMasterAddress) as BIP32Interface;
        this.extendedPublicKeys[walletName][walletAccount][protocol] =
            publicMasterAddress;
        this.addresses[walletName][walletAccount][protocol] = {};
        const derivations = config[this.id].derivations.filter(
            d => d.protocol == protocol,
        );
        for (let derivation of derivations) {
            const address = this.base.generatePublicAddresses({
                publicAccountNode:
                    this.publicNode[walletName][walletAccount][protocol],
                derivation: derivation.name,
                change,
                index,
            });
            if (address) {
                this.addresses[walletName][walletAccount][protocol][
                    derivation.name
                ] = {};
                this.addresses[walletName][walletAccount][protocol][
                    derivation.name
                ][change] = {};
                this.addresses[walletName][walletAccount][protocol][
                    derivation.name
                ][change][index] = address.publicAddress as string;
                if (this.id == Coins.TEZOS || this.id == Coins.FIO) {
                    this.account[walletAccount] = address.account;
                }
            }
        }
        this.initializated = true;
    }
    /**
     * Checks if the given address is valid.
     *
     * @param {string} address - The address to be checked.
     * @return {boolean} Returns true if the address is valid, false otherwise.
     */
    isValidAddress(address: string): boolean {
        return this.base.isValidAddress(address);
    }

    /**
     * Retrieves the minimum balance for a given wallet name.
     *
     * @return {number} The minimum balance for the wallet.
     */
    async getMinimumBalance(_props: any): Promise<number> {
        return 0;
    }
    async getMinimumAmountLeft(_props: any): Promise<number> {
        return 0;
    }
    async getMinimumAmountSend(_props: any): Promise<number> {
        return 0;
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
    setTransactionFormat(_props: any) {
        throw new Error(NotImplemented);
    }
}

export default CoinWallet;
