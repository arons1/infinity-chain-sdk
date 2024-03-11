export type GeneralTransactionEncode = {
    details:Details;
};

type Details = {
    transaction:Transaction;
    meta:Meta
    slot:string;
    blockTime:number;
}
type Meta = {
    preBalances:string[]
    postBalances:string[]
    preTokenBalances:TokenBalances[]
    postTokenBalances:TokenBalances[]
    fee:string;
    status:Record<string,string>
}
type TokenBalances = {
    owner:string;
    mint:string;
    uiTokenAmount:TokenAmount
}
type TokenAmount = {
    amount:string
    uiAmount:number
    uiAmountString:string
}
type Transaction = {
    message: Message
}

type Message = {
    accountKeys:AccountKeys[]
    instructions:Instruction[]
}
type AccountKeys = {
    pubkey:string;
    signer:string;
    writable:boolean
}
type Instruction = {
    program:string;
    parsed:IntructionParsed
}
type IntructionParsed = {
    type:string;
    info:InfoInstruction
}
type InfoInstruction = {
    destination:string;
    source:string
}