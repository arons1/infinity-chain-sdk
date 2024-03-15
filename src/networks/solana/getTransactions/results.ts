import {
    type as pick,
    number,
    string,
    array,
    literal,
    union,
    optional,
    nullable,
    coerce,
    create,
    unknown,
    any,
    Struct,
} from 'superstruct';

function createRpcResult<T, U>(result: Struct<T, U>) {
    return union([
        pick({
            jsonrpc: literal('2.0'),
            id: string(),
            result,
        }),
        pick({
            jsonrpc: literal('2.0'),
            id: string(),
            error: pick({
                code: unknown(),
                message: string(),
                data: optional(any()),
            }),
        }),
    ]);
}
const TransactionErrorResult = nullable(union([pick({}), string()]));
const UnknownRpcResult = createRpcResult(unknown());

function jsonRpcResult<T, U>(schema: Struct<T, U>) {
    return coerce(createRpcResult(schema), UnknownRpcResult, value => {
        if ('error' in value) {
            return value;
        } else {
            return {
                ...value,
                result: create(value.result, schema),
            };
        }
    });
}
export const GetSignaturesForAddressRpcResult = jsonRpcResult(
    array(
        pick({
            signature: string(),
            slot: number(),
            err: TransactionErrorResult,
            memo: nullable(string()),
            blockTime: optional(nullable(number())),
        }),
    ),
);
