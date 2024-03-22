import Web3 from 'web3';
import { Connection } from '@solana/web3.js';
import { Server } from 'stellar-sdk';

export const web3Matic = new Web3('https://polygon-rpc.com');
export const web3Op = new Web3(
    'https://optimism-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8',
);
export const web3Solana = new Connection('https://solnode.guarda.com/');
export const apiStellar = new Server('https://horizon.stellar.org');
