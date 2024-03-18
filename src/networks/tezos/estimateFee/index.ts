import BigNumber from "bignumber.js"
const ADDITIONAL_FEE = 100

export const getAditionalFee = (fee:number) => {
    const nm = new BigNumber(ADDITIONAL_FEE + (ADDITIONAL_FEE*fee)).toString(10)
    return new BigNumber(nm.split('.')[0])
  }