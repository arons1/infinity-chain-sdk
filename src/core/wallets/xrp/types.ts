export type BuildTransactionParams = {
    amount: string;
    from: string;
    to: string;
    memo?: string | undefined;
    mnemonic: string;
};
export type GetTransactionsParams = {
    walletName?: string;
    lastTransactionHash?: string;
};
