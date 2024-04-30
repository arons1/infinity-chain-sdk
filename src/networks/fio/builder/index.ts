import { convertPubKeyToAccount } from '../utils';
import { BuildTransactionFIOResult, BuildTransactionParams } from './types';
import { FIOSDK } from '@fioprotocol/fiosdk';
import { estimateFee } from '../estimateFee';
import { getFIOAccount } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { builderParametersChecker } from '../parametersChecker';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

const fetchJson = async (uri: string, opts = {}) => {
    return fetch(uri, opts);
}; /**
 * buildTransaction
 *
 * Returns a transaction formatted to be sign and send
 *
 * @param {number} [value] - ammount to send (optional)
 * @param {string} source - source account
 * @param {string} destination - destination account
 * @param {string} [privateKey] - Private key
 * @returns {Promise<BuildTransactionFIOResult>} - Returns a transaction formatted to be sign and send
 */
export const buildTransaction = async (
    props: BuildTransactionParams,
): Promise<BuildTransactionFIOResult> => {
    builderParametersChecker(props);
    const address = await convertPubKeyToAccount(props.destination);
    var user = new FIOSDK(
        props.privateKey,
        props.source,
        config[Coins.FIO].rpc[0],
        fetchJson,
    );
    user.setSignedTrxReturnOption(true);
    return await user.genericAction('pushTransaction', {
        action: 'trnsfiopubky',
        account: 'fio.token',
        data: {
            payee_public_key: address,
            amount: props.value,
            max_fee: new BigNumber(
                (await estimateFee(props.source)).fee as string,
            ).toNumber(),
            tpid: '',
            actor: getFIOAccount(props.source),
        },
    });
};
