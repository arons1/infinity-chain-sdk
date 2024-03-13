import { GeneralApiParams } from "../../types";

export const pull = ({ address, page, limit }: GeneralApiParams) => {
    return {
        url:"https://fio.blockpane.com/v1/history/get_actions",
        method: 'POST',
        body:{
            "account_name":address,
            "pos":(page as number)-(limit as number),
            "offset":page
        }
    };
};

export const initPosition = ({address}: GeneralApiParams) => {
    return {
        url:"https://fio.blockpane.com/v1/history/get_actions",
        method: 'POST',
        body:{
            "account_name":address,
            "pos":-1
        }
    };
}