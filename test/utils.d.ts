import Web3 from 'web3';
import { Connection } from '@solana/web3.js';
import { Server } from 'stellar-sdk';
import { TezosToolkit } from '@taquito/taquito';
export declare const web3Matic: Web3<import("web3-eth").RegisteredSubscription>;
export declare const web3Op: Web3<import("web3-eth").RegisteredSubscription>;
export declare const web3Solana: Connection;
export declare const apiStellar: Server;
export declare const web3Tezos: TezosToolkit;
