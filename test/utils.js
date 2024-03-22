"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiStellar = exports.web3Solana = exports.web3Op = exports.web3Matic = void 0;
const web3_1 = __importDefault(require("web3"));
const web3_js_1 = require("@solana/web3.js");
const stellar_sdk_1 = require("stellar-sdk");
exports.web3Matic = new web3_1.default('https://polygon-rpc.com');
exports.web3Op = new web3_1.default('https://optimism-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8');
exports.web3Solana = new web3_js_1.Connection('https://solnode.guarda.com/');
exports.apiStellar = new stellar_sdk_1.Server('https://horizon.stellar.org');
