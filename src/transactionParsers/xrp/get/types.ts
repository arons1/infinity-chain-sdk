export type XrpParams = {
    connector:any,
    address:string,
    lastTransactionHash:string,
    cursor?:string
}

export type QueryParameters = {
    command: string,
    account: string,
    limit: number,
    forward: boolean,
    marker?:string
}