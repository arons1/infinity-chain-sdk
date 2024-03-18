export type BuildTransactionParams = {
    source:string,
    destination:string,
    value:string,
    mintToken?:string,
    privateKey:string,
    web3:any;
    idToken?:number;
    feeRatio?:number
}