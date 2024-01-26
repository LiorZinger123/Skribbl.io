import UserLogin from "../types/userLogin";
import fetchToApi from "./fetch";

export const connect = async (url: string, data: UserLogin): Promise<Response> => {
    try{
        const result = await fetchToApi(url, 'POST', data)
        return result
    }
    catch(e){
        throw e
    }
}