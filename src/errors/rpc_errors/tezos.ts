export const TezosErrorCodes = [
    'michelson_v1.script_rejected', // Script rejected by the protocol
    'contract.balance_too_low', // Contract balance too low
    'gas_exhausted.operation', // Operation gas limit exhausted
    'gas_exhausted.init_deserialize', // Initial deserialization gas limit exhausted
    'unknown_contract', // Unknown contract
    'invalid_syntactic_contract', // Invalid syntactic contract
    'invalid_parameters', // Invalid parameters
    'invalid_contract_code', // Invalid contract code
    'storage_limit_exceeded.operation', // Storage limit exceeded for operation
    'storage_error', // Generic storage error
    'big_map_id_allocated', // Big map ID already allocated
    'script_interpreter.failwith', // Contract failure
    'michelson_v1.runtime_error', // Michelson runtime error
    'invalid_operation', // Invalid operation
    'internal_error', // Internal protocol error
    'block_header.level', // Block header level error
    'block_header.timestamp', // Block header timestamp error
    'block_header.fitness', // Block header fitness error
    'block_header.priority', // Block header priority error
    'block_header.signature', // Block header signature error
    'block_header.proof_of_work_nonce', // Proof of work nonce error
    'block_header.seed_nonce_hash', // Seed nonce hash error
    'block_header.validation_pass', // Block header validation pass error
    'block_header.expected_commitment', // Expected commitment error
    'block_header.context', // Block header context error
    'block_header.predecessor', // Block header predecessor error
    'block_header.fitness_gap', // Block header fitness gap error
    'block_header.protocol_data', // Block header protocol data error
    'operation.signature', // Operation signature error
    'operation.invalid_signature', // Invalid operation signature
    'operation.invalid_public_key', // Invalid public key in operation
    'operation.invalid_branch', // Invalid branch in operation
    'operation.missing_signature', // Missing signature in operation
    'operation.gas_quota_exceeded', // Gas quota exceeded in operation
    'operation.invalid_counter', // Invalid counter in operation
    'operation.revelation_unexpected', // Revelation unexpected in operation
    'operation.revelation_forbidden', // Revelation forbidden in operation
    'operation.too_early_revelation', // Too early revelation in operation
    'operation.invalid_endorsement', // Invalid endorsement in operation
    'operation.invalid_revelation', // Invalid revelation in operation
    'operation.inconsistent_revelation', // Inconsistent revelation in operation
    'operation.invalid_signature_format', // Invalid signature format in operation
    'operation.too_many_operations', // Too many operations in block
    'operation.oversized_operation', // Oversized operation
    'operation.invalid_pkh', // Invalid public key hash in operation
    'operation.missing_operations', // Missing operations in block
    'operation.too_early_endorsement', // Too early endorsement in operation
    'operation.inconsistent_predecessor', // Inconsistent predecessor in operation
    'operation.endorsement_forbidden', // Endorsement forbidden in operation
    'operation.invalid_proof_of_work_nonce', // Invalid proof of work nonce in operation
    'operation.unknown_operation_kind', // Unknown operation kind
    'operation.missing_public_key', // Missing public key in operation
    'operation.invalid_public_key_hash', // Invalid public key hash in operation
    'operation.predecessor_validation', // Predecessor validation error in operation
    'operation.unrevealed_key', // Unrevealed key in operation
    'operation.inconsistent_signature', // Inconsistent signature in operation
    'operation.wrong_order', // Wrong order of operations
    'operation.incorrect_counter', // Incorrect counter in operation
    'operation.missing_key_revelation', // Missing key revelation in operation
    'operation.prevalidation_error', // Prevalidation error in operation
    'operation.validation_error', // Validation error in operation
    'operation.context_error', // Context error in operation
    'operation.storage_exhausted', // Storage exhausted in operation
    'operation.inconsistent_gas_cost', // Inconsistent gas cost in operation
    'operation.inconsistent_storage_cost', // Inconsistent storage cost in operation
    'operation.invalid_chain_id', // Invalid chain ID in operation
    'operation.invalid_branch_level', // Invalid branch level in operation
    'operation.invalid_branch_context', // Invalid branch context in operation
    'operation.invalid_block_header', // Invalid block header in operation
    'operation.invalid_protocol_data', // Invalid protocol data in operation
    'operation.invalid_signature_error', // Invalid signature error in operation
    'operation.invalid_endorsement_error', // Invalid endorsement error in operation
    'operation.invalid_revelation_error', // Invalid revelation error in operation
    'operation.invalid_operation_error', // Invalid operation error in operation
    'operation.unknown_error', // Unknown error in operation
    'operation.invalid_block', // Invalid block in operation
    'operation.invalid_preamble', // Invalid preamble in operation
    'operation.invalid_block_signature', // Invalid block signature in operation
    'operation.invalid_endorsement_signature', // Invalid endorsement signature in operation
    'operation.invalid_revelation_signature', // Invalid revelation signature in operation
    'operation.inconsistent_operations', // Inconsistent operations
    'operation.invalid_nonce_hash', // Invalid nonce hash in operation
    'operation.invalid_reveal_nonce', // Invalid reveal nonce in operation
    'operation.invalid_block_priority', // Invalid block priority in operation
    'operation.invalid_operation_size', // Invalid operation size
    'operation.invalid_block_size', // Invalid block size
    'operation.invalid_micheline', // Invalid Micheline
    'operation.invalid_michelson', // Invalid Michelson
    'operation.invalid_contract_parameters', // Invalid contract parameters
    'operation.invalid_script_code', // Invalid script code
    'operation.invalid_storage_data', // Invalid storage data
    'operation.invalid_ticket', // Invalid ticket
];
