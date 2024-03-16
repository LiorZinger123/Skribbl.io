import React from "react"
import { fetchToApi } from "../../Api/fetch"
import Room from "../../types/room"

type Props = {
    search: string,
    setSearch: React.Dispatch<React.SetStateAction<string>>,
    setSearchRooms: React.Dispatch<React.SetStateAction<Room[]>>,
    setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>
}

const Search = (props: Props) => {

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setSearch(e.target.value)
        try{
            const res = await fetchToApi('rooms/search', {search: e.target.value})
            if(res.ok){
                const rooms = await res.json()
                props.setSearchRooms(rooms)
            }
            else
                props.setShowSearchError(true)
        }
        catch{
            props.setShowSearchError(true)
        }
    }

    return (
        <>
            <input className="search-bar" type="text" value={props.search} onChange={handleChange} placeholder="Search Room" />
        </>
    )
}

export default Search