import { Server } from 'stellar-sdk';

export type AssetExistsRequest = {
    _embedded: {
        records: Asset[];
    };
};

export type Asset = {
    asset_code: string;
    asset_issuer:string;
};

export type AccountExists = {
    account: string;
    connector: Server;
};
