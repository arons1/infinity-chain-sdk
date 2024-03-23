import { Server } from 'stellar-sdk';

export type AssetExistsRequest = {
    _embedded: {
        records: Asset[];
    };
};

export type Asset = {
    asset_code: string;
};

export type AccountExists = {
    account: string;
    connector: Server;
};
