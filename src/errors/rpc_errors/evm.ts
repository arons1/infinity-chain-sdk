export const Web3ErrorCodes = [
    'ERR_ABI_ENCODING', // Error in encoding ABI
    'ERR_CONN', // Connection error
    'ERR_CONN_CLOSE', // Connection closed unexpectedly
    'ERR_CONN_INVALID', // Invalid connection
    'ERR_CONN_MAX_ATTEMPTS', // Maximum connection attempts reached
    'ERR_CONN_NOT_OPEN', // Connection not open
    'ERR_CONN_PENDING_REQUESTS', // Pending requests on the connection
    'ERR_CONN_TIMEOUT', // Connection timeout
    'ERR_CONTRACT', // Contract error
    'ERR_CONTRACT_ABI_MISSING', // ABI missing for contract
    'ERR_CONTRACT_EVENT_NOT_EXISTS', // Event does not exist in contract
    'ERR_CONTRACT_EXECUTION_REVERTED', // Contract execution reverted
    'ERR_CONTRACT_INSTANTIATION', // Error in contract instantiation
    'ERR_CONTRACT_MISSING_ADDRESS', // Contract address missing
    'ERR_CONTRACT_MISSING_DEPLOY_DATA', // Deployment data missing for contract
    'ERR_CONTRACT_MISSING_FROM_ADDRESS', // Sender address missing for contract interaction
    'ERR_CONTRACT_REQUIRED_CALLBACK', // Callback required for contract operation
    'ERR_CONTRACT_RESERVED_EVENT', // Attempted to use reserved event name in contract
    'ERR_CONTRACT_RESOLVER_MISSING', // Resolver missing for contract
    'ERR_CONTRACT_TX_DATA_AND_INPUT', // Both data and input specified in contract transaction
    'ERR_CORE_CHAIN_MISMATCH', // Core chain mismatch error
    'ERR_CORE_HARDFORK_MISMATCH', // Core hardfork mismatch error
    'ERR_ENS_CHECK_INTERFACE_SUPPORT', // ENS interface support check error
    'ERR_ENS_NETWORK_NOT_SYNCED', // ENS network not synced error
    'ERR_ENS_UNSUPPORTED_NETWORK', // Unsupported ENS network error
    'ERR_EXISTING_PLUGIN_NAMESPACE', // Existing plugin namespace error
    'ERR_FORMATTERS', // Formatter error
    'ERR_INVALID_ADDRESS', // Invalid address error
    'ERR_INVALID_BLOCK', // Invalid block error
    'ERR_INVALID_BOOLEAN', // Invalid boolean error
    'ERR_INVALID_BYTES', // Invalid bytes error
    'ERR_INVALID_CLIENT', // Invalid client error
    'ERR_INVALID_HEX', // Invalid hexadecimal error
    'ERR_INVALID_INTEGER', // Invalid integer error
    'ERR_INVALID_KEYSTORE', // Invalid keystore error
    'ERR_INVALID_LARGE_VALUE', // Invalid large value error
    'ERR_INVALID_METHOD_PARAMS', // Invalid method parameters error
    'ERR_INVALID_NIBBLE_WIDTH', // Invalid nibble width error
    'ERR_INVALID_NUMBER', // Invalid number error
    'ERR_INVALID_PASSWORD', // Invalid password error
    'ERR_INVALID_PRIVATE_KEY', // Invalid private key error
    'ERR_INVALID_PROVIDER', // Invalid provider error
    'ERR_INVALID_RESPONSE', // Invalid response error
    'ERR_INVALID_SIGNATURE', // Invalid signature error
    'ERR_INVALID_SIZE', // Invalid size error
    'ERR_INVALID_STRING', // Invalid string error
    'ERR_INVALID_TYPE', // Invalid type error
    'ERR_INVALID_TYPE_ABI', // Invalid ABI type error
    'ERR_INVALID_UNIT', // Invalid unit error
    'ERR_INVALID_UNSIGNED_INTEGER', // Invalid unsigned integer error
    'ERR_IV_LENGTH', // Invalid initialization vector length error
    'ERR_KEY_DERIVATION_FAIL', // Key derivation failure error
    'ERR_KEY_VERSION_UNSUPPORTED', // Unsupported key version error
    'ERR_METHOD_NOT_IMPLEMENTED', // Method not implemented error
    'ERR_MULTIPLE_ERRORS', // Multiple errors encountered
    'ERR_OPERATION_ABORT', // Operation aborted error
    'ERR_OPERATION_TIMEOUT', // Operation timeout error
    'ERR_PARAM', // Parameter error
    'ERR_PBKDF2_ITERATIONS', // PBKDF2 iterations error
    'ERR_PRIVATE_KEY_LENGTH', // Private key length error
    'ERR_PROVIDER', // Provider error
    'ERR_RAW_TX_UNDEFINED', // Undefined raw transaction error
    'ERR_REQ_ALREADY_SENT', // Request already sent error
    'ERR_RESPONSE', // Response error
    'ERR_RPC_INTERNAL_ERROR', // Internal RPC error
    'ERR_RPC_INVALID_INPUT', // Invalid RPC input error
    'ERR_RPC_INVALID_JSON', // Invalid RPC JSON error
    'ERR_RPC_INVALID_METHOD', // Invalid RPC method error
    'ERR_RPC_INVALID_PARAMS', // Invalid RPC parameters error
    'ERR_RPC_INVALID_REQUEST', // Invalid RPC request error
    'ERR_RPC_LIMIT_EXCEEDED', // RPC limit exceeded error
    'ERR_RPC_MISSING_RESOURCE', // Missing RPC resource error
    'ERR_RPC_NOT_SUPPORTED', // RPC method not supported error
    'ERR_RPC_TRANSACTION_REJECTED', // RPC transaction rejected error
    'ERR_RPC_UNAVAILABLE_RESOURCE', // RPC resource unavailable error
    'ERR_RPC_UNSUPPORTED_METHOD', // Unsupported RPC method error
    'ERR_SCHEMA_FORMAT', // Schema format error
    'ERR_SIGNATURE_FAILED', // Signature failed error
    'ERR_SUBSCRIPTION', // Subscription error
    'ERR_TX', // Transaction error
    'ERR_TX_BLOCK_TIMEOUT', // Transaction block timeout error
    'ERR_TX_CHAIN_ID_MISMATCH', // Transaction chain ID mismatch error
    'ERR_TX_CHAIN_MISMATCH', // Transaction chain mismatch error
    'ERR_TX_CONTRACT_NOT_STORED', // Contract not stored in transaction error
    'ERR_TX_DATA_AND_INPUT', // Both data and input specified in transaction error
    'ERR_TX_GAS_MISMATCH', // Gas mismatch error in transaction
    'ERR_TX_GAS_MISMATCH_INNER_ERROR', // Inner error in gas mismatch transaction error
    'ERR_TX_HARDFORK_MISMATCH', // Transaction hardfork mismatch error
    'ERR_TX_INVALID_CALL', // Invalid call in transaction error
    'ERR_TX_INVALID_CHAIN_INFO', // Invalid chain info in transaction error
    'ERR_TX_INVALID_FEE_MARKET_GAS', // Invalid fee market gas in transaction error
    'ERR_TX_INVALID_FEE_MARKET_GAS_PRICE', // Invalid fee market gas price in transaction error
    'ERR_TX_INVALID_LEGACY_FEE_MARKET', // Invalid legacy fee market in transaction error
    'ERR_TX_INVALID_LEGACY_GAS', // Invalid legacy gas in transaction error
    'ERR_TX_INVALID_NONCE_OR_CHAIN_ID', // Invalid nonce or chain ID in transaction error
    'ERR_TX_INVALID_OBJECT', // Invalid object in transaction error
    'ERR_TX_INVALID_PROPERTIES_FOR_TYPE', // Invalid properties for type in transaction error
    'ERR_TX_INVALID_RECEIVER', // Invalid receiver in transaction error
    'ERR_TX_INVALID_SENDER', // Invalid sender in transaction error
    'ERR_TX_LOCAL_WALLET_NOT_AVAILABLE', // Local wallet not available in transaction error
    'ERR_TX_MISSING_CHAIN_INFO', // Missing chain info in transaction error
    'ERR_TX_MISSING_CUSTOM_CHAIN', // Missing custom chain in transaction error
    'ERR_TX_MISSING_CUSTOM_CHAIN_ID', // Missing custom chain ID in transaction error
    'ERR_TX_MISSING_GAS', // Missing gas in transaction error
    'ERR_TX_MISSING_GAS_INNER_ERROR', // Inner error in missing gas transaction error
    'ERR_TX_NOT_FOUND', // Transaction not found error
    'ERR_TX_NO_CONTRACT_ADDRESS', // No contract address found in transaction error
    'ERR_TX_OUT_OF_GAS', // Transaction out of gas error
    'ERR_TX_POLLING_TIMEOUT', // Polling timeout in transaction error
    'ERR_TX_RECEIPT_MISSING_BLOCK_NUMBER', // Missing block number in transaction receipt error
    'ERR_TX_RECEIPT_MISSING_OR_BLOCKHASH_NULL', // Missing or null block hash in transaction receipt error
    'ERR_TX_REVERT_INSTRUCTION', // Revert instruction in transaction error
    'ERR_TX_REVERT_TRANSACTION', // Reverted transaction error
    'ERR_TX_REVERT_TRANSACTION_CUSTOM_ERROR', // Custom error in reverted transaction error
    'ERR_TX_REVERT_WITHOUT_REASON', // Transaction reverted without reason error
    'ERR_TX_SEND_TIMEOUT', // Send timeout in transaction error
    'ERR_TX_SIGNING', // Transaction signing error
    'ERR_TX_UNABLE_TO_POPULATE_NONCE', // Unable to populate nonce in transaction error
    'ERR_TX_UNSUPPORTED_EIP_1559', // EIP-1559 unsupported in transaction error
    'ERR_TX_UNSUPPORTED_TYPE', // Unsupported type in transaction error
    'ERR_UNSUPPORTED_KDF', // Unsupported key derivation function error
    'ERR_VALIDATION', // Validation error
    'ERR_WS_PROVIDER', // WebSocket provider error
    'GENESIS_BLOCK_NUMBER', // Genesis block number error
    'JSONRPC_ERR_CHAIN_DISCONNECTED', // Chain disconnected JSON-RPC error
    'JSONRPC_ERR_DISCONNECTED', // Disconnected JSON-RPC error
    'JSONRPC_ERR_REJECTED_REQUEST', // Rejected request JSON-RPC error
    'JSONRPC_ERR_UNAUTHORIZED', // Unauthorized JSON-RPC error
    'JSONRPC_ERR_UNSUPPORTED_METHOD', // Unsupported method JSON-RPC error
];
