type Transaction = {
    to_: string;
    amount: number;
    token_id: number;
};
type Value = {
    txs: Transaction[];
    from_: string;
};

type Parameters = {
    entrypoint: string;
    value: Value[];
};
type ParametersNotArray = {
    entrypoint: string;
    value: {
        from: string;
        to: string;
        value: string;
    };
};

export type GeneralTransactionEncode = {
    type: string;
    id: number;
    level: number;
    timestamp: string;
    block: string;
    hash: string;
    counter: number;
    initiator?: Address;
    sender: Address;
    senderCodeHash: number;
    nonce: number;
    gasLimit: number;
    gasUsed: number;
    storageLimit: number;
    storageUsed: number;
    bakerFee: number;
    storageFee: number;
    allocationFee: number;
    target?: Address;
    targetCodeHash?: number;
    amount: number;
    parameter: Parameters | ParametersNotArray;
    status: string;
    hasInternals: boolean;
    tokenTransfersCount: number;
};
export enum StandardTypes {
    FA2 = 'fa2',
    FA1_2 = 'fa1.2',
}
type Format = {
    uri: string;
    fileName: string;
    fileSize: string;
    mimeType: string;
    dimensions: {
        unit: string;
        value: string;
    };
};
type Attribute = {
    name: string;
    value: string;
};
type Address = {
    address: string;
    alias?: string;
};
type Royalties = {
    shares: Record<string, string>;
    decimals: string;
};
type Metadata = {
    date: string;
    name: string;
    tags: string[];
    image: string;
    minter: string;
    rights: string;
    symbol: string;
    formats: Format[];
    creators: string[];
    decimals: string;
    royalties: Royalties;
    attributes: Attribute[];
    displayUri: string;
    artifactUri: string;
    description: string;
    mintingTool: string;
    thumbnailUri: string;
};
type Token = {
    id: number;
    contract: Address;
    tokenId: string;
    standard: StandardTypes;
    totalSupply: string;
    metadata: Metadata;
};
export type TokenTransactionEncode = {
    id: number;
    level: number;
    timestamp: string;
    from: Address;
    to: Address;
    token: Token;
    amount: string;
    transactionId: number;
};
