import { decode } from 'bech32-buffer';
import BigNumber from 'bignumber.js';
import { buildSignedBscTx } from './buildTransactionBridge';
import { tokenHubAbi, tokenHubContractAddress } from './abi_bsc';

export const getFeeBSCtoBC = async (web3: any) => {
    const contract = new web3.eth.Contract(
        tokenHubAbi,
        tokenHubContractAddress,
    );
    return await contract.methods.getMiniRelayFee().call();
};
export const getDataBSC = ({
    toAddress,
    amount,
    web3,
}: {
    toAddress: string;
    amount: string;
    web3: any;
}) => {
    const decodeData = decode(toAddress);
    const decodeAddress = Buffer.from(decodeData.data).toString('hex');
    const contract = new web3.eth.Contract(
        tokenHubAbi,
        tokenHubContractAddress,
    );
    const transferOutABI = contract.methods
        .transferOut(
            '0x0000000000000000000000000000000000000000',
            `0x${decodeAddress}`,
            `0x${new BigNumber(amount).toString(16)}`,
            Math.ceil(Date.now() / 1000 + 600),
        )
        .encodeABI();
    return transferOutABI;
};

export const getGasLimitBSC = async ({
    fromAddress,
    toAddress,
    amount,
    web3,
}: {
    fromAddress: string;
    toAddress: string;
    amount: string;
    web3: any;
}) => {
    const data = getDataBSC({ toAddress, amount, web3 });
    const relayFeeWei = await getFeeBSCtoBC(web3);
    const amount_minus_fee = new BigNumber(amount)
        .plus(relayFeeWei)
        .toString(16);
    let estimatedGas;

    try {
        estimatedGas = await web3.eth.estimateGas({
            to: tokenHubContractAddress,
            data,
            value: `0x${amount_minus_fee}`,
            from: fromAddress,
        });
    } catch (e) {
        console.error(e);
    }
    return estimatedGas;
};

export const transferFromBscToBbc = async ({
    privateKey,
    toAddress,
    amount,
    web3,
}: {
    privateKey: string;
    toAddress: string;
    amount: string;
    web3: any;
}) => {
    const decodeData = decode(toAddress);
    const decodeAddress = Buffer.from(decodeData.data).toString('hex');
    const contract = new web3.eth.Contract(
        tokenHubAbi,
        tokenHubContractAddress,
    );

    const transferOutABI = contract.methods
        .transferOut(
            '0x0000000000000000000000000000000000000000',
            `0x${decodeAddress}`,
            web3.utils.toHex(amount),
            Math.ceil(Date.now() / 1000 + 600),
        )
        .encodeABI();
    const relayFeeWei = await getFeeBSCtoBC(web3);
    const amount_minus_fee = new BigNumber(amount)
        .plus(relayFeeWei)
        .toString(10);

    const sendTx = await buildSignedBscTx({
        data: transferOutABI,
        privateKey,
        toAddress: tokenHubContractAddress,
        amount: amount_minus_fee,
        web3,
    });

    return { ...sendTx, relayFeeWei: new BigNumber(relayFeeWei) };
};
