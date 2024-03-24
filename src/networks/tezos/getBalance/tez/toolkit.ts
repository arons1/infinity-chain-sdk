import { TezosToolkit } from '@taquito/taquito';
import memoize from 'p-memoize';
import retry from 'async-retry';

import { FastRpcClient } from './taquitoFastRPC';
import { ReadOnlySigner, michelEncoder } from './helpers';
import {
    RPC_BASE_URL,
    READ_ONLY_SIGNER_PK,
    READ_ONLY_SIGNER_PK_HASH,
} from '../../constants';

export const readOnlySigner = new ReadOnlySigner(
    READ_ONLY_SIGNER_PK_HASH,
    READ_ONLY_SIGNER_PK,
);

export const Tezos = createTezos();
export const loadContract = memoize(fetchContract);

export function createTezos() {
    const tezos = new TezosToolkit(new FastRpcClient(RPC_BASE_URL));
    tezos.setPackerProvider(michelEncoder);
    tezos.setSignerProvider(readOnlySigner);

    return tezos;
}

export function fetchContract(address: string) {
    return retry(() => Tezos.contract.at(address), { retries: 3 });
}
