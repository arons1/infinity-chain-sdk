import axios from 'axios';
import { convertPubKeyToAccount } from '../utils';
import { BuildTransactionParams } from './types';
import { FIOSDK } from '@fioprotocol/fiosdk';
import { estimateFee } from '../estimateFee';

const fetchJson = async (uri: string, opts = {}) => {
    return axios(uri, opts);
};
export const buildTransaction = async ({
    value,
    source,
    destination,
    privateKey,
}: BuildTransactionParams) => {
    const address = await convertPubKeyToAccount(source);
    var user = new FIOSDK(
        privateKey,
        destination,
        'https://fio.blockpane.com/v1',
        fetchJson,
    );
    user.setSignedTrxReturnOption(true);
    return await user.genericAction('pushTransaction', {
        action: 'trnsfiopubky',
        account: 'fio.token',
        data: {
            payee_public_key: address,
            amount: value,
            max_fee: await estimateFee(source),
            tpid: '',
            actor: FIOSDK.accountHash(source).accountnm,
        },
    });
};
