"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3Matic = void 0;
const web3_1 = __importDefault(require("web3"));
exports.web3Matic = new web3_1.default('https://polygon-rpc.com');
