import { InMemorySigner } from '@taquito/signer';
import { BuildTransactionParams } from './types';
import BigNumber from 'bignumber.js';
import { getAditionalFee } from '../estimateFee';

export const buildTransaction = async ({
    source,
    destination,
    value,
    mintToken,
    idToken,
    privateKey,
    web3,
    feeRatio = 0.5
}:BuildTransactionParams) => {
    web3.setSignerProvider(await InMemorySigner.fromSecretKey(privateKey));
    if(mintToken){
        const contract = await web3.contract.at(mintToken)
        let operation: { toTransferParams: () => any; send: (arg0: { fee: number; }) => any; }
        var isFA2 = contract.entrypoints?.entrypoints?.transfer?.prim == "list"
        if(isFA2){
            operation = contract.methods.transfer([
                {
                from_:source,
                txs:[{
                    to_:destination,
                    token_id:idToken ?? 0,
                    amount:value
                }]
                }
            ])
        }
        else{
            operation = contract.methods.transfer(source,destination,value)
        }
        const transferFees = await web3.estimate.transfer(operation.toTransferParams())
        var estimatedBaseFee = new BigNumber(transferFees.suggestedFeeMutez)
        estimatedBaseFee = estimatedBaseFee.plus(getAditionalFee(feeRatio))
        return () => operation.send({fee:estimatedBaseFee.toNumber()})
    }
    else{
        const transferFees = await web3.estimate.transfer({ to: destination, amount:value })
        var estimatedBaseFee = new BigNumber(transferFees.suggestedFeeMutez)
        estimatedBaseFee = estimatedBaseFee.plus(getAditionalFee(feeRatio))
        return () => web3.contract.transfer({
          to: destination,
          amount: value,
          fee:estimatedBaseFee.toNumber()
        })
    }
}