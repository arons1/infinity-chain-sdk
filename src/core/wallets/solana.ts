
import { NotImplemented } from "@infinity/core-sdk/lib/commonjs/errors";
import { buildTransaction, estimateFee, getAccountBalances, getBalance, sendTransaction } from "../../networks/solana";
import { TransactionBuilderParams } from "../../networks/solana/builder/types";
import { GetAccountsTransactionsParams, GetBalanceParams } from "../../networks/solana/getBalance/types";
import { SendTransactionParams } from "../../networks/solana/sendTransaction/types";
import { BalanceResult, CurrencyBalanceResult, EstimateFeeResult } from "../../networks/types";
import CoinWallet from "../wallet";
import { GetChangeAddressParams, GetReceiveAddressParams } from "../type";

class SolanaWallet extends CoinWallet {
    estimateFee(_props: any): Promise<EstimateFeeResult> {
        return estimateFee(_props) ;
    }
    buildTransaction(_props: TransactionBuilderParams): Promise<string> {
        return buildTransaction(_props)
    }
    getBalance(_props: GetBalanceParams): Promise<CurrencyBalanceResult> {
        return getBalance(_props)
    }
    getAccountBalances(_props: GetAccountsTransactionsParams): Promise<Record<string, BalanceResult[]>> {
        return getAccountBalances(_props)
    }
    sendTransaction(_props: SendTransactionParams): Promise<string> {
        return sendTransaction(_props)
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector(_props: any) {
        throw new Error(NotImplemented);
    }
    getReceiveAddress(_props: GetReceiveAddressParams): string {
        throw new Error(NotImplemented);
    }

}

export default SolanaWallet