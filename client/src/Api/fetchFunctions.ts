import CreateUser from "../types/createUser";
import User from "../types/user";
import fetchToApi from "./fetch";

export const connect = async (url: string, data: User | CreateUser): Promise<Response> => {
    try{
        const result = await fetchToApi(url, 'POST', data)
        return result
    }
    catch(e){
        throw e
    }
}