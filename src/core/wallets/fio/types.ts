export type BuildTransactionParams = {
    value: string;
    destination: string;
    mnemonic: string;
    walletName: string;
};
export type GetTransactionsParams = {
    walletName?:string,
    endBlock:string
}