export enum SolanaErrorCodes {
    TRANSACTION_SIMULATION_FAILED = -32002, // Error in transaction simulation
    BLOCKHASH_NOT_FOUND = -32002, // Blockhash not found error
    TRANSACTION_SIGNATURE_VERIFICATION_FAILURE = -32003, // Transaction signature verification failure
    BLOCK_NOT_AVAILABLE = -32004, // Block not available error
    NODE_UNHEALTHY = -32005, // Unhealthy node error
    SLOT_SKIPPED = -32007, // Slot skipped error
    SLOT_MISSING_IN_STORAGE = -32009, // Slot missing in storage error
    RPC_METHOD_UNAVAILABLE = -32010, // RPC method unavailable error
    SIGNATURE_LENGTH_MISMATCH = -32013, // Signature length mismatch error
    BLOCK_STATUS_NOT_AVAILABLE = -32014, // Block status not available error
    UNSUPPORTED_TRANSACTION_VERSION = -32015, // Unsupported transaction version error
    MINIMUM_CONTEXT_SLOT_NOT_REACHED = -32016, // Minimum context slot not reached error
    INVALID_PARAMS = -32602 // Invalid parameters error
}
