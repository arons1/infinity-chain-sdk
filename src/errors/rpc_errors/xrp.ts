export const XRPErrorCodes = [
    'tefALREADY', // "The same exact transaction has already been applied."
    'tefBAD_AUTH', // "The key used to sign this account is not authorized to modify this account. (It could be authorized if the account had the same key set as the Regular Key.)"
    'tefBAD_AUTH_MASTER', // "The single signature provided to authorize this transaction does not match the master key, but no regular key is associated with this address."
    'tefBAD_LEDGER', // "While processing the transaction, the ledger was discovered in an unexpected state. If you can reproduce this error, please report an issue to get it fixed."
    'tefBAD_QUORUM', // "The transaction was multi-signed, but the total weights of all included signatures did not meet the quorum."
    'tefBAD_SIGNATURE', // "The transaction was multi-signed, but contained a signature for an address not part of a SignerList associated with the sending account."
    'tefEXCEPTION', // "While processing the transaction, the server entered an unexpected state. This may be caused by unexpected inputs, for example if the binary data for the transaction is grossly malformed. If you can reproduce this error, please report an issue to get it fixed."
    'tefFAILURE', // "Unspecified failure in applying the transaction."
    'tefINTERNAL', // "When trying to apply the transaction, the server entered an unexpected state. If you can reproduce this error, please report an issue to get it fixed."
    'tefINVARIANT_FAILED', // "An invariant check failed when trying to claim the transaction cost. Added by the EnforceInvariants amendment. If you can reproduce this error, please report an issue."
    'tefMASTER_DISABLED', // "The transaction was signed with the account's master key, but the account has the lsfDisableMaster field set."
    'tefMAX_LEDGER', // "The transaction included a LastLedgerSequence parameter, but the current ledger's sequence number is already higher than the specified value."
    'tefNFTOKEN_IS_NOT_TRANSFERABLE', // "The transaction attempted to send a non-fungible token to another account, but the NFToken has the lsfTransferable flag disabled and the transfer would not be to or from the issuer. (Added by the NonFungibleTokensV1_1 amendment.)"
    'tefNO_AUTH_REQUIRED', // "The TrustSet transaction tried to mark a trust line as authorized, but the lsfRequireAuth flag is not enabled for the corresponding account, so authorization is not necessary."
    'tefNO_TICKET', // "The transaction attempted to use a Ticket, but the specified TicketSequence number does not exist in the ledger, and cannot be created in the future because it is earlier than the sender's current sequence number."
    'tefNOT_MULTI_SIGNING', // "The transaction was multi-signed, but the sending account has no SignerList defined."
    'tefPAST_SEQ', // "The sequence number of the transaction is lower than the current sequence number of the account sending the transaction."
    'tefTOO_BIG', // "The transaction would affect too many objects in the ledger. For example, this was an AccountDelete transaction but the account to be deleted owns over 1000 objects in the ledger."
    'tefWRONG_PRIOR', // "The transaction contained an AccountTxnID field (or the deprecated PreviousTxnID field), but the transaction specified there does not match the account's previous transaction."
    'tecAMM_ACCOUNT', //	168	The transaction failed because the operation is not allowed on Automated Market Maker (AMM) accounts. (Requires the AMM amendment)
    'tecAMM_ACCOUNT', //	168	The transaction failed because the operation is not allowed on Automated Market Maker (AMM) accounts. (Requires the AMM amendment)
    'tecAMM_UNFUNDED', //	162	The AMMCreate transaction failed because the sender does not have enough of the specified assets to fund it. (Requires the AMM amendment)
    'tecAMM_BALANCE', //	163	The AMMDeposit or AMMWithdraw transaction failed because either the AMM or the user does not hold enough of one of the specified assets. (For example, you tried to withdraw more than the AMM holds.) (Requires the AMM amendment)
    'tecAMM_EMPTY', //	166	The AMM-related transaction failed because the AMM has no assets in its pool. In this state, you can only delete the AMM or fund it with a new deposit. (Requires the AMM amendment)
    'tecAMM_FAILED', //	164	The AMM-related transaction failed. For AMMDeposit or AMMWithdraw this could be because the sender does not have enough of the specified assets, or the transaction requested an effective price that isn't possible with the available amounts. For AMMBid this could be because the account does not have enough to win the bid or needs more than their specified maximum bid. For AMMVote, this could be because there are already too many votes from other accounts that hold more of this AMM's LP Tokens. (Requires the AMM amendment)
    'tecAMM_INVALID_TOKENS', //	165	The AMM-related transaction failed due to insufficient LP Tokens or problems with rounding; for example, depositing a very small amount of assets could fail if the amount of LP Tokens to be returned rounds down to zero. (Requires the AMM amendment)
    'tecAMM_NOT_EMPTY', //	167	The transaction was meant to operate on an AMM with empty asset pools, but the specified AMM currently holds assets. (Requires the AMM amendment)
    'tecCANT_ACCEPT_OWN_NFTOKEN_OFFER', //	157	The transaction tried to accept an offer that was placed by the same account to buy or sell a non-fungible token. (Added by the NonFungibleTokensV1_1 amendment.)
    'tecCLAIM', //	100	Unspecified failure, with transaction cost destroyed.
    'tecCRYPTOCONDITION_ERROR', //	146	This EscrowCreate or EscrowFinish transaction contained a malformed or mismatched crypto-condition.
    'tecDIR_FULL', //	121	The transaction tried to add an object (such as a trust line, Check, Escrow, or Payment Channel) to an account's owner directory, but that account cannot own any more objects in the ledger.
    'tecDUPLICATE', //	149	The transaction tried to create an object (such as a DepositPreauth authorization) that already exists.
    'tecDST_TAG_NEEDED', //	143	The Payment transaction omitted a destination tag, but the destination account has the lsfRequireDestTag flag enabled.
    'tecEXPIRED', //	148	The transaction tried to create an object (such as an Offer or a Check) whose provided Expiration time has already passed.
    'tecFAILED_PROCESSING', //	105	An unspecified error occurred when processing the transaction.
    'tecFROZEN', //	137	The OfferCreate transaction failed because one or both of the assets involved are subject to a global freeze.
    'tecHAS_OBLIGATIONS', //	151	The AccountDelete transaction failed because the account to be deleted owns objects that cannot be deleted. See Deleting Accounts for details.
    'tecINSUFF_FEE', //	136	The transaction failed because the sending account does not have enough XRP to pay the transaction cost that it specified. (In this case, the transaction processing destroys all of the sender's XRP even though that amount is lower than the specified transaction cost.) This result only occurs if the account's balance decrease after this transaction has been distributed to enough of the network to be included in a consensus set. Otherwise, the transaction fails with terINSUFF_FEE_B before being distributed.
    'tecINSUFFICIENT_FUNDS', //	158	One of the accounts involved does not hold enough of a necessary asset. (Added by the NonFungibleTokensV1_1 amendment.)
    'tecINSUFFICIENT_PAYMENT', //	161	The amount specified is not enough to pay all fees involved in the transaction. For example, when trading a non-fungible token, the buy amount may not be enough to pay both the broker fee and the sell amount. (Added by the NonFungibleTokensV1_1 amendment.)
    'tecINSUFFICIENT_RESERVE', //	141	The transaction would increase the reserve requirement higher than the sending account's balance. SignerListSet, PaymentChannelCreate, PaymentChannelFund, and EscrowCreate can return this error code. See Signer Lists and Reserves for more information.
    'tecINTERNAL', //	144	Unspecified internal error, with transaction cost applied. This error code should not normally be returned. If you can reproduce this error, please report an issue.
    'tecINVARIANT_FAILED', //	147	An invariant check failed when trying to execute this transaction. Added by the EnforceInvariants amendment. If you can reproduce this error, please report an issue.
    'tecKILLED', //	150	The OfferCreate transaction specified the tfFillOrKill flag and could not be filled, so it was killed. (Added by the fix1578 amendment.)
    'tecMAX_SEQUENCE_REACHED', //	153	A sequence number field is already at its maximum. This includes the MintedNFTokens field. (Added by the NonFungibleTokensV1_1 amendment.)
    'tecNEED_MASTER_KEY', //	142	This transaction tried to cause changes that require the master key, such as disabling the master key or giving up the ability to freeze balances.
    'tecNFTOKEN_BUY_SELL_MISMATCH', //	155	The NFTokenAcceptOffer transaction attempted to match incompatible offers to buy and sell a non-fungible token. (Added by the NonFungibleTokensV1_1 amendment.)
    'tecNFTOKEN_OFFER_TYPE_MISMATCH', //	156	One or more of the offers specified in the transaction was not the right type of offer. (For example, a buy offer was specified in the NFTokenSellOffer field.) (Added by the NonFungibleTokensV1_1 amendment.)
    'tecNO_ALTERNATIVE_KEY', //	130	The transaction tried to remove the only available method of authorizing transactions. This could be a SetRegularKey transaction to remove the regular key, a SignerListSet transaction to delete a SignerList, or an AccountSet transaction to disable the master key. (Prior to rippled 0.30.0, this was called tecMASTER_DISABLED.)
    'tecNO_AUTH', //	134	The transaction failed because it needs to add a balance on a trust line to an account with the lsfRequireAuth flag enabled, and that trust line has not been authorized. If the trust line does not exist at all, tecNO_LINE occurs instead.
    'tecNO_DST', //	124	The account on the receiving end of the transaction does not exist. This includes Payment and TrustSet transaction types. (It could be created if it received enough XRP.)
    'tecNO_DST_INSUF_XRP', //	125	The account on the receiving end of the transaction does not exist, and the transaction is not sending enough XRP to create it.
    'tecNO_ENTRY', //	140	The transaction tried to modify a ledger object, such as a Check, Payment Channel, or Deposit Preauthorization, but the specified object does not exist. It may have already been deleted by a previous transaction or the transaction may have an incorrect value in an ID field such as CheckID, Channel, Unauthorize.
    'tecNO_ISSUER', //	133	The account specified in the issuer field of a currency amount does not exist.
    'tecNO_LINE', //	135	The TakerPays field of the OfferCreate transaction specifies an asset whose issuer has lsfRequireAuth enabled, and the account making the offer does not have a trust line for that asset. (Normally, making an offer implicitly creates a trust line if necessary, but in this case it does not bother because you cannot hold the asset without authorization.) If the trust line exists, but is not authorized, tecNO_AUTH occurs instead.
    'tecNO_LINE_INSUF_RESERVE', //	126	The transaction failed because the sending account does not have enough XRP to create a new trust line. (See: Reserves) This error occurs when the counterparty does not have a trust line to this account for the same currency. (See tecINSUF_RESERVE_LINE for the other case.)
    'tecNO_LINE_REDUNDANT', //	127	The transaction failed because it tried to set a trust line to its default state, but the trust line did not exist.
    'tecNO_PERMISSION', //	139	The sender does not have permission to do this operation. For example, the EscrowFinish transaction tried to release a held payment before its FinishAfter time, someone tried to use PaymentChannelFund on a channel the sender does not own, or a Payment tried to deliver funds to an account with the "DepositAuth" flag enabled.
    'tecNO_REGULAR_KEY', //	131	The AccountSet transaction tried to disable the master key, but the account does not have another way to authorize transactions. If multi-signing is enabled, this code is deprecated and tecNO_ALTERNATIVE_KEY is used instead.
    'tecNO_SUITABLE_NFTOKEN_PAGE', //	154	The transaction tried to mint or acquire a non-fungible token but the account receiving the NFToken does not have a directory page that can hold it. This situation is rare. (Added by the NonFungibleTokensV1_1 amendment.)
    'tecNO_TARGET', //	138	The transaction referenced an Escrow or PayChannel ledger object that doesn't exist, either because it never existed or it has already been deleted. (For example, another EscrowFinish transaction has already executed the held payment.) Alternatively, the destination account has asfDisallowXRP set so it cannot be the destination of this PaymentChannelCreate or EscrowCreate transaction.
    'tecOBJECT_NOT_FOUND', //	160	One of the objects specified by this transaction did not exist in the ledger. (Added by the NonFungibleTokensV1_1 amendment.)
    'tecOVERSIZE', //	145	This transaction could not be processed, because the server created an excessively large amount of metadata when it tried to apply the transaction.
    'tecOWNERS', //	132	The transaction cannot succeed because the sender already owns objects in the ledger. For example, an account cannot enable the lsfRequireAuth flag if it has any trust lines or available offers.
    'tecPATH_DRY', //	128	The transaction failed because the provided paths did not have enough liquidity to send anything at all. This could mean that the source and destination accounts are not linked by trust lines.
    'tecPATH_PARTIAL', //	101	The transaction failed because the provided paths did not have enough liquidity to send the full amount.
    'tecTOO_SOON', //	152	The AccountDelete transaction failed because the account to be deleted had a Sequence number that is too high. The current ledger index must be at least 256 higher than the account's sequence number.
    'tecUNFUNDED', //	129	The transaction failed because the account does not hold enough XRP to pay the amount in the transaction and satisfy the additional reserve necessary to execute this transaction.
    'tecUNFUNDED_PAYMENT', //	104	The transaction failed because the sending account is trying to send more XRP than it holds, not counting the reserve.
    'tecUNFUNDED_OFFER', //	103	The OfferCreate transaction failed because the account creating the offer does not have any of the TakerGets currency.
    'telBAD_DOMAIN', //	The transaction specified a domain value (for example, the Domain field of an AccountSet transaction) that cannot be used, probably because it is too long to store in the ledger.
    'telBAD_PATH_COUNT', //	The transaction contains too many paths for the local server to process.
    'telBAD_PUBLIC_KEY', //	The transaction specified a public key value (for example, as the MessageKey field of an AccountSet transaction) that cannot be used, probably because it is not the right length.
    'telCAN_NOT_QUEUE', //	The transaction did not meet the open ledger cost, but this server did not queue this transaction because it did not meet the queuing restrictions. For example, a transaction returns this code when the sender already has 10 other transactions in the queue. You can try again later or sign and submit a replacement transaction with a higher transaction cost in the Fee field.
    'telCAN_NOT_QUEUE_BALANCE', //	The transaction did not meet the open ledger cost and also was not added to the transaction queue because the sum of potential XRP costs of already-queued transactions is greater than the expected balance of the account. You can try again later, or try submitting to a different server.
    'telCAN_NOT_QUEUE_BLOCKS', //	The transaction did not meet the open ledger cost and also was not added to the transaction queue. This transaction could not replace an existing transaction in the queue because it would block already-queued transactions from the same sender. (For details, see Queuing Restrictions.) You can try again later, or try submitting to a different server.
    'telCAN_NOT_QUEUE_BLOCKED', //	The transaction did not meet the open ledger cost and also was not added to the transaction queue because a transaction queued ahead of it from the same sender blocks it. (For details, see Queuing Restrictions.) You can try again later, or try submitting to a different server.
    'telCAN_NOT_QUEUE_FEE', //	The transaction did not meet the open ledger cost and also was not added to the transaction queue. This code occurs when a transaction with the same sender and sequence number already exists in the queue and the new one does not pay a large enough transaction cost to replace the existing transaction. To replace a transaction in the queue, the new transaction must have a Fee value that is at least 25% more, as measured in fee levels. You can increase the Fee and try again, send this with a higher Sequence number so it doesn't replace an existing transaction, or try sending to another server.
    'telCAN_NOT_QUEUE_FULL', //	The transaction did not meet the open ledger cost and the server did not queue this transaction because this server's transaction queue is full. You could increase the Fee and try again, try again later, or try submitting to a different server. The new transaction must have a higher transaction cost, as measured in fee levels, than the transaction in the queue with the smallest transaction cost.
    'telFAILED_PROCESSING', //	An unspecified error occurred when processing the transaction.
    'telINSUF_FEE_P', //	The Fee from the transaction is not high enough to meet the server's current transaction cost requirement, which is derived from its load level and network-level requirements. If the individual server is too busy to process your transaction right now, it may cache the transaction and automatically retry later.
    'telLOCAL_ERROR', //	Unspecified local error. The transaction may be able to succeed if you submit it to a different server.
    'telNETWORK_ID_MAKES_TX_NON_CANONICAL', //	The transaction specifies the NetworkID field, but the current network rules require that the NetworkID field be omitted. (Mainnet and other networks with a chain ID of 1024 or less do not use this field.) If the transaction was intended for a network that does not use NetworkID, remove the field and try again. If the transaction was intended for a different network, submit it to a server that is connected to the correct network. New in: rippled 1.11.0
    'telNO_DST_PARTIAL', //	The transaction is an XRP payment that would fund a new account, but the tfPartialPayment flag was enabled. This is disallowed.
    'telREQUIRES_NETWORK_ID', //	The transaction does not specify a NetworkID field, but the current network requires one. If the transaction was intended for a network that requires NetworkID, add the field and try again. If the transaction was intended for a different network, submit it to a server that is connected to the correct network. New in: rippled 1.11.0
    'telWRONG_NETWORK', //	The transaction specifies the wrong NetworkID value for the current network. Either specify the correct the NetworkID value for the intended network, or submit the transaction to a server that is connected to the correct network.
    'temBAD_AMM_TOKENS', //	The transaction incorrectly specified one or more assets. For example, the asset's issuer does not match the corresponding asset in the AMM's pool, or the transaction specified the same asset twice. (Requires the AMM amendment)
    'temBAD_AMOUNT', //	An amount specified by the transaction (for example the destination Amount or SendMax values of a Payment) was invalid, possibly because it was a negative number.
    'temBAD_AUTH_MASTER', //	The key used to sign this transaction does not match the master key for the account sending it, and the account does not have a Regular Key set.
    'temBAD_CURRENCY', //	The transaction improperly specified a currency field. See Specifying Currency Amounts for the correct format.
    'temBAD_EXPIRATION', //	The transaction improperly specified an expiration value, for example as part of an OfferCreate transaction. Alternatively, the transaction did not specify a required expiration value, for example as part of an EscrowCreate transaction.
    'temBAD_FEE', //	The transaction improperly specified its Fee value, for example by listing a non-XRP currency or some negative amount of XRP.
    'temBAD_ISSUER', //	The transaction improperly specified the issuer field of some currency included in the request.
    'temBAD_LIMIT', //	The TrustSet transaction improperly specified the LimitAmount value of a trust line.
    'temBAD_NFTOKEN_TRANSFER_FEE', //	The NFTokenMint transaction improperly specified the TransferFee field of the transaction. (Added by the NonFungibleTokensV1_1 amendment.)
    'temBAD_OFFER', //	The OfferCreate transaction specifies an invalid offer, such as offering to trade XRP for itself, or offering a negative amount.
    'temBAD_PATH', //	The Payment transaction specifies one or more Paths improperly, for example including an issuer for XRP, or specifying an account differently.
    'temBAD_PATH_LOOP', //	One of the Paths in the Payment transaction was flagged as a loop, so it cannot be processed in a bounded amount of time.
    'temBAD_SEND_XRP_LIMIT', //	The Payment transaction used the tfLimitQuality flag in a direct XRP-to-XRP payment, even though XRP-to-XRP payments do not involve any conversions.
    'temBAD_SEND_XRP_MAX', //	The Payment transaction included a SendMax field in a direct XRP-to-XRP payment, even though sending XRP should never require SendMax. (XRP is only valid in SendMax if the destination Amount is not XRP.)
    'temBAD_SEND_XRP_NO_DIRECT', //	The Payment transaction used the tfNoDirectRipple flag for a direct XRP-to-XRP payment, even though XRP-to-XRP payments are always direct.
    'temBAD_SEND_XRP_PARTIAL', //	The Payment transaction used the tfPartialPayment flag for a direct XRP-to-XRP payment, even though XRP-to-XRP payments should always deliver the full amount.
    'temBAD_SEND_XRP_PATHS', //	The Payment transaction included Paths while sending XRP, even though XRP-to-XRP payments should always be direct.
    'temBAD_SEQUENCE', //	The transaction is references a sequence number that is higher than its own Sequence number, for example trying to cancel an offer that would have to be placed after the transaction that cancels it.
    'temBAD_SIGNATURE', //	The signature to authorize this transaction is either missing, or formed in a way that is not a properly-formed signature. (See tekNO_PERMISSION for the case where the signature is properly formed, but not authorized for this account.)
    'temBAD_SRC_ACCOUNT', //	The Account on whose behalf this transaction is being sent (the "source account") is not a properly-formed account address.
    'temBAD_TRANSFER_RATE', //	The TransferRate field of an AccountSet transaction is not properly formatted or out of the acceptable range.
    'temCANNOT_PREAUTH_SELF', //	The sender of the DepositPreauth transaction was also specified as the account to preauthorize. You cannot preauthorize yourself.
    'temDST_IS_SRC', //	The transaction improperly specified a destination address as the Account sending the transaction. This includes trust lines (where the destination address is the issuer field of LimitAmount) and payment channels (where the destination address is the Destination field).
    'temDST_NEEDED', //	The transaction improperly omitted a destination. This could be the Destination field of a Payment transaction, or the issuer sub-field of the LimitAmount field fo a TrustSet transaction.
    'temINVALID', //	The transaction is otherwise invalid. For example, the transaction ID may not be the right format, the signature may not be formed properly, or something else went wrong in understanding the transaction.
    'temINVALID_COUNT', //	The transaction includes a TicketCount field, but the number of Tickets specified is invalid.
    'temINVALID_FLAG', //	The transaction includes a Flag that does not exist, or includes a contradictory combination of flags.
    'temMALFORMED', //	Unspecified problem with the format of the transaction.
    'temREDUNDANT', //	The transaction would do nothing; for example, it is sending a payment directly to the sending account, or creating an offer to buy and sell the same currency from the same issuer.
    'temREDUNDANT_SEND_MAX', //	Removed in: rippled 0.28.0
    'temRIPPLE_EMPTY', //	The Payment transaction includes an empty Paths field, but paths are necessary to complete this payment.
    'temBAD_WEIGHT', //	The SignerListSet transaction includes a SignerWeight that is invalid, for example a zero or negative value.
    'temBAD_SIGNER', //	The SignerListSet transaction includes a signer who is invalid. For example, there may be duplicate entries, or the owner of the SignerList may also be a member.
    'temBAD_QUORUM', //	The SignerListSet transaction has an invalid SignerQuorum value. Either the value is not greater than zero, or it is more than the sum of all signers in the list.
    'temUNCERTAIN', //	Used internally only. This code should never be returned.
    'temUNKNOWN', //	Used internally only. This code should never be returned.
    'temDISABLED', //	The transaction requires logic that is disabled. Typically this means you are trying to use an amendment that is not enabled for the current ledger.
    'terINSUF_FEE_B', //	The account sending the transaction does not have enough XRP to pay the Fee specified in the transaction.
    'terLAST', //	Used internally only. This code should never be returned.
    'terNO_ACCOUNT', //	The address sending the transaction is not funded in the ledger (yet).
    'terNO_AMM', //	The AMM-related transaction specifies an asset pair that does not currently have an AMM instance. (Requires the AMM amendment)
    'terNO_AUTH', //	The transaction would involve adding currency issued by an account with lsfRequireAuth enabled to a trust line that is not authorized. For example, you placed an offer to buy a currency you aren't authorized to hold.
    'terNO_LINE', //	Used internally only. This code should never be returned.
    'terNO_RIPPLE', //	Used internally only. This code should never be returned.
    'terOWNERS', //	The transaction requires that account sending it has a nonzero "owners count", so the transaction cannot succeed. For example, an account cannot enable the lsfRequireAuth flag if it has any trust lines or available offers.
    'terPRE_SEQ', //	The Sequence number of the current transaction is higher than the current sequence number of the account sending the transaction.
    'terPRE_TICKET', //	The transaction attempted to use a Ticket, but the specified TicketSequence number does not exist in the ledger. However, the Ticket could still be created by another transaction.
    'terQUEUED', //	The transaction met the load-scaled transaction cost but did not meet the open ledger requirement, so the transaction has been queued for a future ledger.
    'terRETRY', //	Unspecified retriable error.
    'terSUBMITTED', //	Transaction has been submitted, but not yet applied.
    'tesSUCCESS', // The transaction was applied to the ledger.
];
