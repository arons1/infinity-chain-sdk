"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/evm/builder");
const estimateFee_1 = require("../../../lib/commonjs/networks/op/estimateFee");
const utils_1 = require("../../utils");
const core_1 = require("@infinity/core-sdk/lib/commonjs/core");
(0, globals_1.describe)('networksOP', () => {
    (0, globals_1.test)('estimateL1Cost', async () => {
        const built = await (0, builder_1.buildTransaction)({
            web3: utils_1.web3Op,
            chainId: 10,
            destination: '0xfF8996c5961D138bd01a75c2DDa2d6944658F685',
            source: '0xE7A38be77db0fEc3cff01c01838508201BCB5a07',
            feeRatio: 0.5,
            value: '1000000000000',
        });
        const cost = await (0, estimateFee_1.estimateL1Cost)(utils_1.web3Op, built);
        (0, globals_1.expect)(new core_1.BigNumber(cost).toNumber()).toBeGreaterThan(56428092841);
    });
});
