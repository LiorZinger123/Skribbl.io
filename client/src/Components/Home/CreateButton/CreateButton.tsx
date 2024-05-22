import React, { useContext, useState } from "react"
import { StableNavigateContext } from "../../../App"
import Cookies from "js-cookie"

type Props = {
    setShowTokenError: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateButton = (props: Props) => {
 
    const nav = useContext(StableNavigateContext)
    const [popup, setPopup] = useState<boolean>(false)
    
    const handleClick = (): void => {
        const token = Cookies.get('Login')
        if(token)
            nav('/createroom')
        else
            props.setShowTokenError(true)
    }

    return (
    <div className="create-btn-div">
        {popup && <div className="popup create-popup">Create Room</div>}
        <button className="create-btn" onClick={handleClick} 
            onMouseEnter={() => setPopup(true)} onMouseLeave={() => setPopup(false)}>+</button>
    </div>
  )
}

export default CreateButton