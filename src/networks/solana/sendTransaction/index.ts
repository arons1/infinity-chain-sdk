import { TransactionError } from '@solana/web3.js';
import { sendTransactionParametersChecker } from '../parametersChecker';
import { SendTransactionParams } from './types';
import { CannotSendTransaction } from '../../../errors/networks';
import {
    AccountNotFound,
    BlockhashNotFound,
    InstructionError,
    NotEnoughBalance,
    TransactionTooLarge,
} from '../../../errors/rpc_errors/solana';

enum SolanaErrorCode {
    BlockhashNotFound = 0,
    TransactionTooLarge = 1,
    InsufficientFunds = 2,
    AccountNotFound = 3,
    InstructionError = 4,
    UnknownError = 999,
}

// Define a custom error class for detailed error handling
class SolanaTransactionError extends Error {
    constructor(
        message: string,
        public code: SolanaErrorCode,
        public details?: any,
    ) {
        super(message);
        this.name = 'SolanaTransactionError';
    }
}
/**
 * Sends a transaction to the Solana blockchain.
 *
 * @param props - The transaction properties
 * @param {Buffer} props.rawTransaction - The raw transaction hex
 * @param {Connection} props.connector - The Solana web3 connector
 *
 * @returns {Promise<string>} The transaction signature
 */
export const sendTransaction = async (
    props: SendTransactionParams,
): Promise<string> => {
    sendTransactionParametersChecker(props);
    try {
        const txId = await props.connector.sendRawTransaction(
            props.rawTransaction,
            {
                skipPreflight: false,
                preflightCommitment: 'singleGossip',
            },
        );
        // Confirm the transaction
        const confirmation = await props.connector.confirmTransaction(
            txId,
            'singleGossip',
        );
        if (confirmation.value.err) {
            console.error(confirmation.value.err);
            throw new SolanaTransactionError(
                'Transaction failed',
                SolanaErrorCode.UnknownError,
                confirmation.value.err,
            );
        }

        console.log('Transaction successful with ID:', txId);
        return txId;
    } catch (error: any) {
        console.error(error);
        if (error instanceof SolanaTransactionError) {
            throw new Error(CannotSendTransaction);
        } else {
            if (error.message.includes('blockhash not found')) {
                throw new Error(BlockhashNotFound);
            } else if (error.message.includes('transaction too large')) {
                throw new Error(TransactionTooLarge);
            } else if (error.message.includes('insufficient funds')) {
                throw new Error(NotEnoughBalance);
            } else if (error.message.includes('AccountNotFound')) {
                throw new Error(AccountNotFound);
            } else if (error.message.includes('InstructionError')) {
                const errorDetails = error.details as {
                    instructionIndex: number;
                    customError?: number;
                };
                if (errorDetails) {
                    console.error(
                        `Instruction at index ${errorDetails.instructionIndex} failed.`,
                    );
                    if (errorDetails.customError !== undefined) {
                        console.error(
                            `Custom error code: ${errorDetails.customError}`,
                        );
                    }
                }
                throw new Error(InstructionError);
            } else {
                throw new Error(CannotSendTransaction);
            }
        }
    }
};
