const api = import.meta.env.VITE_API
const port = import.meta.env.VITE_API_PORT

const fetchToApi = async (url: string, data: unknown): Promise<Response> => {
    try{
        const res = await fetch(`${api}:${port}/${url}`,{
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"
        })
        return res
    }
    catch(e){
        throw e
    }
}

const getFromApi = async (url: string): Promise<Response> => {
    try{
        const res = await fetch(`${api}:${port}/${url}`,{
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        })
        return res
    }
    catch(e){
        throw e
    }
}

export { fetchToApi, getFromApi }