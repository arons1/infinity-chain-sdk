export const StellarErrorCodes = [
    'tx_success', //The transaction succeeded.
    'tx_failed', //One of the operations failed (none were applied).
    'tx_too_early', //The ledger closeTime was before the minTime.
    'tx_too_late', //The ledger closeTime was after the maxTime.
    'tx_missing_operation', //No operation was specified
    'tx_bad_seq', //sequence number does not match source account
    'tx_bad_auth', //too few valid signatures / wrong network
    'tx_insufficient_balance', //fee would bring account below reserve
    'tx_no_source_account', //source account not found
    'tx_insufficient_fee', //fee is too small
    'tx_bad_auth_extra', //unused signatures attached to transaction
    'tx_internal_error', //an unknown error occured
];

export const StellarOperationErrorCodes = [
    'op_inner', //The inner object result is valid and the operation was a success.
    'op_bad_auth', //There are too few valid signatures, or the transaction was submitted to the wrong network.
    'op_no_source_account', //The source account was not found.
    'op_not_supported', //The operation is not supported at this time.
    'op_too_many_subentries', //Max number of subentries (1000) already reached
    'op_exceeded_work_limit', //Operation did too much work
];
