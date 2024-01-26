const fetchToApi = async (url: string, method: string, data: unknown): Promise<Response> => {
    try{
        const res = await fetch(`http://localhost:8000/${url}`,{
            method:method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"
        })
        return res
    }
    catch{
        throw new Error("Failed to fetch api")
    }
}

export default fetchToApi