import Web3 from 'web3';

export type SendTransactionParams = {
    connector: Web3;
    rawTransaction: string;
};
