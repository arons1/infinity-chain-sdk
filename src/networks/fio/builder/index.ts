import { convertPubKeyToAccount } from '../utils';
import { BuildTransactionFIOResult, BuildTransactionParams } from './types';
import { FIOSDK } from '@fioprotocol/fiosdk';
import { estimateFee } from '../estimateFee';
import { getFIOAccount } from '@infinity/core-sdk/lib/commonjs/networks/evm';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';

const fetchJson = async (uri: string, opts = {}) => {
    return fetch(uri, opts);
};
/* 
buildTransaction
    Returns a transaction formatted to be sign and send
    @param value: ammount to send (optional)
    @param source: source account
    @param destination: destination account
    @param privateKey: Private key
*/
export const buildTransaction = async ({
    value,
    source,
    destination,
    privateKey,
}: BuildTransactionParams): Promise<BuildTransactionFIOResult> => {
    const address = await convertPubKeyToAccount(destination);
    var user = new FIOSDK(
        privateKey,
        source,
        'https://fio.blockpane.com/v1/',
        fetchJson,
    );
    user.setSignedTrxReturnOption(true);
    return await user.genericAction('pushTransaction', {
        action: 'trnsfiopubky',
        account: 'fio.token',
        data: {
            payee_public_key: address,
            amount: value,
            max_fee: new BigNumber(
                (await estimateFee({ source })).fee as string,
            ).toNumber(),
            tpid: '',
            actor: getFIOAccount(source),
        },
    });
};
