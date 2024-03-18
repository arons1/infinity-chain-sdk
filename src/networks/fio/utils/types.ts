export type FIOBalance = {
    permissions:FIOBalanceOwner[]
}

type FIOBalanceOwner = {
    perm_name:string;
    required_auth:KeyOwned
}
type KeyOwned = {
    keys:Key[]
}
type Key = {
    key:string
}
