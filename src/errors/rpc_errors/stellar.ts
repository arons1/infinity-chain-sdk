export enum StellarErrorCodes {
    TRANSACTION_FAILED = 'transaction_failed', // Transaction failed error
    TRANSACTION_MISSING_OPERATION = 'transaction_missing_operation', // Transaction missing operation error
    TRANSACTION_BAD_SEQUENCE = 'transaction_bad_sequence', // Transaction bad sequence error
    TRANSACTION_BAD_AUTH = 'transaction_bad_auth', // Transaction bad auth error
    TRANSACTION_INSUFFICIENT_BALANCE = 'transaction_insufficient_balance', // Transaction insufficient balance error
    TRANSACTION_NO_ACCOUNT = 'transaction_no_account', // Transaction no account error
    TRANSACTION_INSUFFICIENT_FEE = 'transaction_insufficient_fee', // Transaction insufficient fee error
    TRANSACTION_BAD_AUTH_EXTRA = 'transaction_bad_auth_extra', // Transaction bad auth extra error
    TRANSACTION_INTERNAL_ERROR = 'transaction_internal_error', // Transaction internal error
    TRANSACTION_NOT_SUPPORTED = 'transaction_not_supported', // Transaction not supported error
    TRANSACTION_TOO_EARLY = 'transaction_too_early', // Transaction too early error
    TRANSACTION_TOO_LATE = 'transaction_too_late', // Transaction too late error
    TRANSACTION_MISSING_OPERATION_SOURCE = 'transaction_missing_operation_source', // Transaction missing operation source error
    ACCOUNT_NOT_FOUND = 'account_not_found', // Account not found error
    SIGNER_NOT_FOUND = 'signer_not_found', // Signer not found error
    DATA_NOT_FOUND = 'data_not_found', // Data not found error
    OFFER_NOT_FOUND = 'offer_not_found', // Offer not found error
    CLAIMABLE_BALANCE_NOT_FOUND = 'claimable_balance_not_found', // Claimable balance not found error
    CLAIMABLE_BALANCE_CLAIMANT_CONFLICT = 'claimable_balance_claimant_conflict', // Claimable balance claimant conflict error
    CLAIMABLE_BALANCE_CANNOT_CLAIM = 'claimable_balance_cannot_claim', // Claimable balance cannot claim error
    CLAIMABLE_BALANCE_LINE_FULL = 'claimable_balance_line_full', // Claimable balance line full error
    STREAM_EXCEPTION = 'stream_exception' // Stream exception error
}