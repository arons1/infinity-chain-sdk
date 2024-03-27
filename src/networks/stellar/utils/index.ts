import axios, { AxiosResponse } from 'axios';
import { AccountExists, AssetExistsRequest } from './types';
import StellarSdk, { Asset } from 'stellar-sdk';
import { accountExistsParametersChecker } from '../parametersChecker';

/* 
assetExists
    Checks if an asset account exists for the passed account
    @param code: code of the asset
    @param issuer: issuer od the asset
*/
export const assetExists = async (code: string, issuer: string) => {
    return new Promise(resolve => {
        axios
            .get(
                `https://horizon.stellar.org/assets?asset_issuer=${issuer.toUpperCase()}`,
            )
            .then((a: AxiosResponse<AssetExistsRequest>) => {
                if (a.data && a.data._embedded && a.data._embedded.records) {
                    resolve(
                        a.data._embedded.records.find(
                            b =>
                                b.asset_code.toLowerCase() ==
                                code.toLowerCase(),
                        ) != undefined,
                    );
                } else {
                    resolve(false);
                }
            })
            .catch(e => {
                console.error(e);
                resolve(false);
            });
    });
};
/* 
accountExists
    Checks if an asset account exists
    @param connector: Stellar api connector
    @param account: account to check if it exists
*/
export const accountExists = async (props: AccountExists) => {
    accountExistsParametersChecker(props);
    try {
        await props.connector.loadAccount(props.account);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};
/* 
makeAsset
    Make an asset
    @param code: Code of the asset
    @param issuer: Issuer of the asset
*/
export const makeAsset = (code?: string, issuer?: string): Asset => {
    if (!code || !issuer) return StellarSdk.Asset.native();
    return new StellarSdk.Asset(code.toUpperCase(), issuer.toUpperCase());
};
