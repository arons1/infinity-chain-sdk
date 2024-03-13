import { GeneralApiParams } from "../../types";

export const pull = ({ address, page, limit }: GeneralApiParams) => {
    return {
        url:"https://fio.blockpane.com/v1/history/get_actions",
        method: 'POST',
        body:{
            "account_name":address,
            "pos":page,
            "offset":(page as number)+(limit as number)
        }
    };
};
