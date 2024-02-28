export type Transaction = {
    blockNumber: string,
    timeStamp: string,
    hash: string,
    from: string,
    to: string,
    value: string,
    isError: boolean,
    contractAddress: string,
    fee?: string,
    confirmations: string,
    tokenName?:string,
    tokenSymbol?:string,
    tokenDecimal?:number,
    gasUsed?:string
    extraId?:string
}