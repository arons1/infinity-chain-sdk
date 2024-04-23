
import CoinWallet from "../wallet";

class SolanaWallet extends CoinWallet {
    estimateFee(_props: any) {
        throw new Error('Method not implemented.');
    }
    buildTransaction(_props: any) {
        throw new Error('Method not implemented.');
    }
    getBalance(_props: any) {
        throw new Error('Method not implemented.');
    }
    sendTransaction(_props: any) {
        throw new Error('Method not implemented.');
    }
    getTransactions(_props: any) {
        throw new Error('Method not implemented.');
    }
}

export default SolanaWallet